import { useState, useEffect, useCallback } from "react";

import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

import TableHeader from "src/layouts/components/table/TableHeader";
import DataTable from "src/layouts/components/table/DataTable";

// Common component for listing data in a table using material data grid
const DataList = ({
  showFilter = true,
  renderFilters,
  showHeader = true,
  filters,
  loading,
  columns,
  rows,
  paginationData,
  fetchData,
  onAdd,
  setFilters
}) => {
  const [searchVal, setSearchVal] = useState("");
  const [searchInputTouched, setSearchInputTouched] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    //debounce to limit number of request on search input change
    const identifier = setTimeout(() => {
      if (searchInputTouched) {
        resetPagination();
        setFilters(prevState => ({ ...prevState, search: searchVal }));
      }
    }, 250);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchVal]);

  const getData = useCallback(async () => {
    //fetch data based on page & selected filters
    fetchData(paginationModel.page + 1);
  }, [paginationModel]);

  useEffect(() => {
    getData();
  }, [getData, filters]);

  const resetPagination = () => {
    //reset to page 1 on applying sort/filter
    setPaginationModel(prevState => {
      return { ...prevState, page: 0 };
    });
  };

  return (
    <>
      {showFilter && (
        <>
          <CardHeader title="Search Filters" />
          <CardContent>{renderFilters()}</CardContent>
          <Divider sx={{ m: "0 !important" }} />
        </>
      )}

      {showHeader && (
        <TableHeader
          search={searchVal}
          setSearch={setSearchVal}
          setSearchInputTouched={setSearchInputTouched}
          onAdd={onAdd}
        />
      )}

      <DataTable
        rows={rows || []}
        columns={columns || []}
        total={paginationData?.total}
        loading={loading}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        setSelectedSort={sort => setFilters(prevState => ({ ...prevState, sort: sort }))}
        lastPage={paginationData?.lastPage}
      />
    </>
  );
};

export default DataList;
