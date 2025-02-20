export  class BaseRequestModel {
    pageNo: number
    pageSize: number
    searchQuery: string 
    sortColumn: string 
    sortOrder: string
    constructor(pageNo: number = 1, pageSize: number = 10, searchQuery: string = '', sortColumn: string = '', sortOrder: string = '') {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
        this.sortColumn = sortColumn;
        this.sortOrder = sortOrder;
    }
}

