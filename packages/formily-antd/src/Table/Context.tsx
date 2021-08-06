import { createContext } from 'react';
import { ArrayField, Field } from '@formily/core';
import { useContext } from 'react';

const ArrayContext = createContext({} as ArrayField);
const ArrayIndexContext = createContext(0);

const ArrayContextProvider = ArrayContext.Provider;

const ArrayIndexContextProvider = ArrayIndexContext.Provider;

const useArray = () => {
    return useContext(ArrayContext);
};

const useArrayIndex = () => {
    return useContext(ArrayIndexContext);
};

export {
    ArrayContextProvider,
    useArray,
    ArrayIndexContextProvider,
    useArrayIndex,
};
