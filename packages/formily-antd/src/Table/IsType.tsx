function isColumnType(name?: string) {
    return name && name.endsWith('.Column');
}

function isRadioColumnType(name?: string) {
    return name && name.endsWith('.RadioColumn');
}

function isCheckedColumnType(name?: string) {
    return name && name.endsWith('.CheckboxColumn');
}

function isNestedRowType(name?: string) {
    return name && name.endsWith('.NestedRow');
}

function isExpandableRowType(name?: string) {
    return name && name.endsWith('.ExpandableRow');
}

function isRecursiveRowType(name?: string) {
    return name && name.endsWith('.RecursiveRow');
}

export {
    isColumnType,
    isCheckedColumnType,
    isRadioColumnType,
    isNestedRowType,
    isExpandableRowType,
    isRecursiveRowType,
};
