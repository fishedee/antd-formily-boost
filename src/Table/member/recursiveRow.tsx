import { batch } from '@formily/reactive';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { flatDataInIndex, fillDataInIndex } from '../util';
import { TableConfig } from './config';

function getRecursiveRow(
    data: any[],
    tableConfig: TableConfig,
):
    | {
          expandedProps: ExpandableConfig<any>;
      }
    | undefined {
    if (!tableConfig.childrenColumn && !tableConfig.recursiveColumn) {
        return;
    }
    const expandedRowKeys = flatDataInIndex(
        data,
        tableConfig.commonExpandedProps!.expandedIndex,
        '',
        0,
        !!tableConfig.commonExpandedProps?.defaultExpand,
        tableConfig.dataConvertProps.tree,
        true, //如果该层处于收缩的状态，提前停止往下查找expand状态的行
    );
    const onExpandedRowsChange = (newExpandedRowKeys: any) => {
        batch(() => {
            fillDataInIndex(
                data,
                tableConfig.commonExpandedProps!.expandedIndex!,
                expandedRowKeys,
                newExpandedRowKeys,
            );
        });
    };
    return {
        expandedProps: {
            ...tableConfig.commonExpandedProps,
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: onExpandedRowsChange,
        },
    };
}

export default getRecursiveRow;
