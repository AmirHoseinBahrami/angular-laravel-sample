<?php

namespace App\Components\DataTable;


class DataTable
{
    public $dataTable;
    public function __construct(DataTableInterface $dataTable)
    {
        $this->dataTable = $dataTable;
    }

    public function generate(array $data)
    {
        return $this->dataTable->generateOutput($data);
    }
}
