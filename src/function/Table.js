/** @format */

import React from "react"
import BootstrapTable from "react-bootstrap-table-next"
import ToolkitProvider from "react-bootstrap-table2-toolkit"

const Table = (tableInfo) => {
  const { data, columns, pagination } = tableInfo
  return (
    <>
      <ToolkitProvider keyField="id" data={data ? data : []} columns={columns}>
        {(props) => (
          <div>
            <BootstrapTable
              noDataIndication="داده ای یافت نشد ابتدا از صحت اینترنت خود اطمینان حاصل بفرمایید و سپس صفحه را بروزرسانی کنید"
              onDataSizeChange={(e) => {
                return true
              }}
              onTableChange={(e) => {
                return true
              }}
              loading={true}
              remote={{
                filter: true,
                pagination: true,
                sort: false,
                cellEdit: true,
              }}
              bordered={false}
              pagination={pagination}
              {...props.baseProps}
              bootstrap4
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  )
}

export default Table
