import Basic from './basic';
import Multiple from './multiple';
import None from './none';
import User from './user';
import { render } from '@testing-library/react';
import React from 'react';
test('Basic', () => {
    const { asFragment } = render(<Basic />);
    expect(asFragment()).toMatchSnapshot();
});

test('Multiple', () => {
    const { asFragment } = render(<Multiple />);
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
