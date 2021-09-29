import ColumnCombine from './columnCombine';
import ColumnControl from './columnControl';
import ColumnControl2 from './columnControl2';
import ColumnReact from './columnReact';
import ColumnWidth from './columnWidth';
import { render } from '@testing-library/react';
import React from 'react';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => {
            return {
                matches: true,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            };
        }),
    });
});
test('ColumnCombine', () => {
    const { asFragment } = render(<ColumnCombine />);
    expect(asFragment()).toMatchSnapshot();
});

test('ColumnControl', () => {
    const { asFragment } = render(<ColumnControl />);
    expect(asFragment()).toMatchSnapshot();
});

test('ColumnControl2', () => {
    const { asFragment } = render(<ColumnControl2 />);
    expect(asFragment()).toMatchSnapshot();
});

test('ColumnReact', () => {
    const { asFragment } = render(<ColumnReact />);
    expect(asFragment()).toMatchSnapshot();
});

test('ColumnWidth', () => {
    const { asFragment } = render(<ColumnWidth />);
    expect(asFragment()).toMatchSnapshot();
});
