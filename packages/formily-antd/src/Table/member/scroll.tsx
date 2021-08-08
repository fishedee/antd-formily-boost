import { TableProps as RcTableProps } from 'rc-table/lib/Table';

function getScroll(scroll: RcTableProps<any>['scroll']) {
    return scroll;
}

export default getScroll;
