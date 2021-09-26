import { createForm, Form, IFormProps } from '@formily/core';
import { observable, toJS } from '@formily/reactive';
import { useEffect } from 'react';
import { useMemo } from 'react';

let formCache = new Map<string, object>();

export function invalidFormCacheByKey(prefixKey: string) {
    let cacheKeys = formCache.keys();
    for (let key of cacheKeys) {
        if (key.startsWith(prefixKey)) {
            formCache.delete(key);
        }
    }
}

export function clearFormCache() {
    formCache.clear();
}

type useFormOption = {
    cacheKey?: string;
};

type FormProps<T extends object = any> = IFormProps<T> & { values: Partial<T> };

type FormPropsAll<T extends object = any> = FormProps<T> | (() => FormProps<T>);

export function createFormProps<T extends object = any>(
    data: FormProps<T>,
): FormProps<T> {
    return data;
}
/*
设计目标
* 缓存，为什么不在useQuery进行ajax缓存，而是在form进行缓存。因为我们要保存用户在输入表单但没有提高到服务器的数据，这样用户即使切换了菜单回来以后还能看得到
* 表单，需要保留表单原有的功能，需要第一个参数依然是IFormProps<T>
* 表单与data分离，大部分情况我们直接操作data就可以了，因为formily的特性，表单数据与data数据是自动双向同步，这能大幅简化data源与其他普通UI组件的整合
* 单页面的多个同一类型组件缓存，一个Table页面中有多个User Select组件（同一类型），这些组件都共用一个form缓存，并且在useQuery中传入firstDidNotRefresh=isCacheData来避免重复拉取数据
*/
function useForm<T extends object = any>(
    formProps: FormPropsAll<T>,
    options?: useFormOption,
): { form: Form<T>; isCacheData: boolean } {
    let result = useMemo(() => {
        let initialValue: object | undefined;
        let isCacheData = false;
        //先尝试从cacheKey拿
        if (options?.cacheKey) {
            initialValue = formCache.get(options?.cacheKey);
            if (initialValue) {
                isCacheData = true;
            }
        }
        let formValue: FormProps<T>;
        if (typeof formProps == 'function') {
            formValue = formProps();
        } else {
            formValue = formProps;
        }
        if (!initialValue) {
            initialValue = formValue.values;
            if (options?.cacheKey) {
                //写入到cache里面
                formCache.set(options?.cacheKey, initialValue);
            }
        }
        formValue.values = initialValue;
        return {
            form: createForm(formValue),
            isCacheData: isCacheData,
        };
    }, []);

    useEffect(() => {
        return () => {
            //当前页面退出的时候，自动写入到缓存中
            if (options?.cacheKey) {
                let originData = toJS(result.form.values);
                formCache.set(options?.cacheKey, originData);
            }
        };
    }, []);

    return result;
}

export default useForm;
