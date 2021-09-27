import { Field, Form, onFieldInputValueChange } from '@formily/core';
import { useMemo } from 'react';
import useQuery from './useQuery';
import { throttle } from 'underscore';
import { useCallback } from 'react';
import { batch } from '@formily/reactive';

export type UseQueryTableProps = {
    filter: any;
    paginaction: { current: number; pageSize: number; total: number };
    list: any[];
};

export type UseQueryTableOptions = {
    refreshOnFilterChange?: boolean;
    firstDidNotRefresh?: boolean;
    cacheKey?: string;
    cacheTime?: number;
};

//form由外部传入，而是自己生成，让QueryTable只做以下的工作
// * 对页码变化，筛选项变化后自动刷新
// * 拉取数据时，传入url，页码，和筛选项来刷新
// * 对刷新提供throttle的功能
function useQueryTable(
    ajaxUrl: string,
    form: Form<UseQueryTableProps>,
    options?: UseQueryTableOptions,
) {
    //带限流的fetch
    let fetchThrottle = () => {};

    useMemo(() => {
        //监听复杂数据变化的时候，要用onFieldInputValueChange，不要用onFieldValueChange
        //onFieldInputValueChange，是仅仅组件收到用户输入产生的数据变化时才会触发
        //onFieldValueChange，是数据任意发生变化的时候就会触发
        //一旦使用onFieldValueChange来触发ajax，那么当开发者使用filter.xx=1,filter.yy=2的时候，就会自动触发两次fetch，这显然会容易产生意料之外的坑。
        //更合理做法是，开发者使用filter.xx=1,filter.yy=2，然后手动触发单次fetch。所以是用onFieldInputValueChange
        form.addEffects('useTable.page', () => {
            if (options?.refreshOnFilterChange) {
                //筛选项变化的时候，需要经过throttle，也需要重置页码
                onFieldInputValueChange('filter.*', () => {
                    fetchThrottle();
                });
            }
            //使用onFieldInputValueChange来触发页码变化
            //页码变化的时候，不需要经过throttle，也不需要重置页码
            onFieldInputValueChange('paginaction.*(current,pageSize)', (f) => {
                queryBoostInfo.fetch();
            });
        });
    }, []);

    const queryBoostInfo = useQuery(
        async (request) => {
            let result = await request({
                url: ajaxUrl,
                method: 'GET',
                data: {
                    ...form.values.filter,
                    pageIndex:
                        (form.values.paginaction.current - 1) *
                        form.values.paginaction.pageSize,
                    pageSize: form.values.paginaction.pageSize,
                },
            });

            if (result.status == 'fail') {
                return;
            }
            let newResult = result;
            //批量触发，避免多次render，提高效率
            batch(() => {
                (form.values.list = newResult.data.data),
                    (form.values.paginaction.total = newResult.data.count);
            });
        },
        {
            //使用refreshDeps产生的ajax触发的注意点在于
            //current与pageSize字段无论是用户输入的，还是开发者手动变更的，都会自动产生fetch，这点要注意的
            firstDidNotRefresh: options?.firstDidNotRefresh,
            cacheKey: options?.cacheKey,
            cacheTime: options?.cacheTime,
        },
    );
    const submitFilter = () => {
        //总是需要重置为第1页，这点容易忽略
        form.values.paginaction.current = 1;
        queryBoostInfo.fetch();
    };

    fetchThrottle = useMemo(() => {
        //感谢@https://github.com/everfire130，当使用leading为false的时候会与Select组件的动画撞车，导致Select组件掉帧
        //因此，不能用debounce为200的延迟，会产生Select组件的掉帧
        //也不能用throttle的leading设置为false的200延迟，也会掉帧
        return throttle(submitFilter, 200);
    }, []);

    const resetFilter = useCallback(() => {
        //重置filter，这个不会触发onInputChange，所以没有产生fetch
        form.values.filter = {};
        submitFilter();
    }, []);
    return {
        ...queryBoostInfo,
        fetchThrottle,
        submitFilter,
        resetFilter,
    };
}

export default useQueryTable;
