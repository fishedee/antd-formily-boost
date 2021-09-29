import Basic from './basic';
import Style from './style';
import None from './none';
import User from './user';
import Virtual from './virtual';
import { render } from '@testing-library/react';
import React from 'react';
test('Basic', () => {
    const { asFragment } = render(<Basic />);
    expect(asFragment()).toMatchSnapshot();
});

test('Style', () => {
    const { asFragment } = render(<Style />);
    expect(asFragment()).toMatchSnapshot();
});

test('None', () => {
    const { asFragment } = render(<None />);
    expect(asFragment()).toMatchSnapshot();
});

test('User', () => {
    const { asFragment } = render(<User />);
    expect(asFragment()).toMatchSnapshot();
});

test('Virtual', () => {
    const { asFragment } = render(<Virtual />);
    expect(asFragment()).toMatchSnapshot();
});
