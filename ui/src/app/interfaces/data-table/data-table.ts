/** data table column interface that call from backend or can be generate here*/


export interface IDataTableHeader {
  id : number,
  caption : string,
  field : string,
  type : string,
  width : number,
  searchable : string,
  sortable : string
}

