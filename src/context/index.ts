import React from 'react';
import { GlobalContextProps, ScatterContextProps } from '@/context/interface';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const GlobalContext = React.createContext<GlobalContextProps>({});
export const ScatterContext = React.createContext<ScatterContextProps>({});
