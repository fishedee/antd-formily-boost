import { RecursiveRowProps } from '../components/RecursiveRow';
import { ColumnSchema } from './columnSchema';

function getRecursiveRow(
    tableColumns: ColumnSchema[]
): RecursiveRowProps | undefined {
    let columns = tableColumns.filter(
        (column) => column.type == 'recursiveRow'
    );
    if (columns.length == 0) {
        return undefined;
    }
    let column = columns[0];
    if (!column.recursiveProps) {
        return undefined;
    }
    if (!column.recursiveProps.dataIndex) {
        return undefined;
    }
    return column.recursiveProps;
}

export default getRecursiveRow;
