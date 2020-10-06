import { MatPaginatorIntl } from '@angular/material/paginator';

const chineseRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `无记录`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `当前显示: ${startIndex + 1} - ${endIndex} 条, 共 ${length} 条`;
}


export function getChinesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = '每页行数';
  paginatorIntl.firstPageLabel = '第一页';
  paginatorIntl.lastPageLabel = '最后一页'
  paginatorIntl.nextPageLabel = '下一页';
  paginatorIntl.previousPageLabel = '上一页';
  paginatorIntl.getRangeLabel = chineseRangeLabel;
  
  return paginatorIntl;
}