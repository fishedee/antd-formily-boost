import useForm, { createFormProps } from './useForm';
import useQuery from './useQuery';
import { IFormProps, onFieldInputValueChange } from '@formily/core';
import { useMemo } from 'react';
import { clearQueryCache } from './useQuery';
import { throttle } from 'underscore';

type TableBoostProps = {
    filter: any;
    paginaction: { current: 1; pageSize: 10; total: 0 };
    list: any[];
};

type TableBoostOptions = {
    refreshOnFilterChange?: boolean;
};
function useTableBoost(
    ajaxUrl: string,
    form: IFormProps<TableBoostProps> = {},
    options?: TableBoostOptions,
) {
    useMemo(() => {
        //每个页面的queryCache都要清空
        clearQueryCache();
    }, []);

    //带限流的fetch
    let fetchThrottle = () => {};
    const formInfo = useForm(() => {
        if (options?.refreshOnFilterChange) {
            let oldEffects = form.effects ? form.effects : () => {};
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
            (formInfo.data.list = result.data.data),
                (formInfo.data.paginaction.total = result.data.count);
        },
        {
            refreshDeps: [
                formInfo.data.paginaction.current,
                formInfo.data.paginaction.pageSize,
            ],
        },
    );
    fetchThrottle = useMemo(() => {
        //FIXME 不明原因
        //debounce会产生Select组件的卡顿
        //throttle的leading设置为false也会卡顿
        return throttle(() => {
            //重置页码
            formInfo.data.paginaction.current = 1;
            queryBoostInfo.fetch();
        }, 200);
    }, []);
    const resetFilter = useMemo(() => {
        //重置页码与filter
        formInfo.data.filter = {};
        formInfo.data.paginaction.current = 1;
        queryBoostInfo.fetch();
    }, []);
    return {
        ...formInfo,
        ...queryBoostInfo,
        fetchThrottle,
        resetFilter,
    };
}

export default useTableBoost;
