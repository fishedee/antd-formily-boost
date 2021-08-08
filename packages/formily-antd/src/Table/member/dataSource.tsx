type DataSourceType = {
    _index: string;
    _current: number;
};

function getDataSourceRecursive(
    preIndex: string,
    data: any[],
    recursiveIndex?: string
): DataSourceType[] {
    let result = [];
    for (var i = 0; i != data.length; i++) {
        var single: any = {
            _index: preIndex != '' ? preIndex + '.' + i : i + '',
            _current: i,
        };
        if (recursiveIndex) {
            let children = data[i][recursiveIndex];
            if (children && children.length != 0) {
                single._children = getDataSourceRecursive(
                    single._index + '.' + recursiveIndex,
                    children,
                    recursiveIndex
                );
            }
        }
        result.push(single);
    }
    return result;
}

function getDataSource(data: any[], recursiveIndex?: string): DataSourceType[] {
    return getDataSourceRecursive('', data, recursiveIndex);
}

export default getDataSource;
