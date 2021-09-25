import { IFormProps, onFieldInputValueChange } from '@formily/core';
import { useMemo } from 'react';
import useForm, { createFormProps } from './useForm';
import useQuery from './useQuery';
import { throttle } from 'underscore';
import { useCallback } from 'react';
import { batch } from '@formily/reactive';

type TableBoostProps = {
    filter: any;
    paginaction: { current: 1; pageSize: 10; total: 0 };
    list: any[];
};

type TableBoostOptions = {
    refreshOnFilterChange?: boolean;
    firstDidNotRefresh?: boolean;
    cacheKey?: string;
    cacheTime?: number;
};
function useTableBoost(
    ajaxUrl: string,
    form: IFormProps<TableBoostProps> = {},
    options?: TableBoostOptions,
) {
    //带限流的fetch
    let fetchThrottle = () => {};
    const formInfo = useForm(() => {
        if (options?.refreshOnFilterChange) {
            let oldEffects = form.effects ? form.effects : () => {};
            //监听复杂数据变化的时候，要用onFieldInputValueChange，不要用onFieldValueChange
            //onFieldInputValueChange，是仅仅组件收到用户输入产生的数据变化时才会触发
            //onFieldValueChange，是数据任意发生变化的时候就会触发
            //一旦使用onFieldValueChange来触发ajax，那么当开发者使用filter.xx=1,filter.yy=2的时候，就会自动触发两次fetch，这显然会容易产生意料之外的坑。
            //更合理做法是，开发者使用filter.xx=1,filter.yy=2，然后手动触发单次fetch。所以是用onFieldInputValueChange
            form.effects = (form) => {
                onFieldInputValueChange('filter.*', () => {
                    fetchThrottle();
                });
                oldEffects(form);
            };
        }
        return createFormProps({
            ...form,
            values: {
                filter: {},
                paginaction: { current: 1, pageSize: 10, total: 0 },
                list: [],
            },
        });
    }, {});
    const queryBoostInfo = useQuery(
        async (request) => {
            let result = await request({
                url: ajaxUrl,
                method: 'GET',
                data: {
                    ...formInfo.data.filter,
                    pageIndex:
                        (formInfo.data.paginaction.current - 1) *
                        formInfo.data.paginaction.pageSize,
                    pageSize: formInfo.data.paginaction.pageSize,
                },
            });

            if (result.status == 'fail') {
                return;
            }
            let newResult = result;
            //批量触发，避免多次render，提高效率
            batch(() => {
                (formInfo.data.list = newResult.data.data),
                    (formInfo.data.paginaction.total = newResult.data.count);
            });
        },
        {
            //使用refreshDeps产生的ajax触发的注意点在于
            //current与pageSize字段无论是用户输入的，还是开发者手动变更的，都会自动产生fetch，这点要注意的
            refreshDeps: [
                formInfo.data.paginaction.current,
                formInfo.data.paginaction.pageSize,
            ],
            firstDidNotRefresh: options?.firstDidNotRefresh,
            cacheKey: options?.cacheKey,
            cacheTime: options?.cacheTime,
        },
    );
    //提交的时候，要做两件事
    //* 将页码置为第一页
    //* 调用fetch
    //* 误区：
    //* 同时将页码设置为第一页，并执行fetch，这容易产生多次的fetch。因为当页码不在第1页的时候，修改页码为1，会自动产生fetch。然后手动调用fetch，又会产生一次fetch
    const submitFilter = useCallback(() => {
        if (formInfo.data.paginaction.current != 1) {
            //重置页码，会触发fetch
            formInfo.data.paginaction.current = 1;
        } else {
            //页码本来就是第1页的，手动触发fetch
            queryBoostInfo.fetch();
        }
    }, []);
    fetchThrottle = useMemo(() => {
        //感谢@https://github.com/everfire130，当使用leading为false的时候会与Select组件的动画撞车，导致Select组件掉帧
        //因此，不能用debounce为200的延迟，会产生Select组件的掉帧
        //也不能用throttle的leading设置为false的200延迟，也会掉帧
        return throttle(submitFilter, 200);
    }, []);

    const resetFilter = useCallback(() => {
        //重置filter，这个不会触发onInputChange，所以没有产生fetch
        formInfo.data.filter = {};
        submitFilter();
    }, []);
    return {
        ...formInfo,
        ...queryBoostInfo,
        fetchThrottle,
        submitFilter,
        resetFilter,
    };
}

export default useTableBoost;
