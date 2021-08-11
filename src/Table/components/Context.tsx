import { createContext } from 'react';
import { ArrayField, Field } from '@formily/core';
import { useContext } from 'react';

const ArrayContext = createContext({} as ArrayField);
const ArrayIndexContext = createContext('');
const ArrayRecursiveContext = createContext<string | undefined>('');

const ArrayContextProvider = ArrayContext.Provider;

const ArrayIndexContextProvider = ArrayIndexContext.Provider;

const ArrayRecursiveContextProvider = ArrayRecursiveContext.Provider;

const useArray = () => {
    return useContext(ArrayContext);
};

const useArrayIndex = () => {
    return useContext(ArrayIndexContext);
};

const useArrayRecursive = () => {
    return useContext(ArrayRecursiveContext);
};

export {
    ArrayContextProvider,
    useArray,
    ArrayIndexContextProvider,
    useArrayIndex,
    ArrayRecursiveContextProvider,
    useArrayRecursive,
};
