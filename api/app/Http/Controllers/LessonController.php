<?php

namespace App\Http\Controllers;

use App\Http\Requests\DBResourceDataTableRequest;
use App\Models\Lesson;
use App\Repositories\Repository;
use App\Traits\CrudActions;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class LessonController extends BaseController
{
    use CrudActions;

    protected $repository;
    protected $validation =
    [
        'dbResourceDataTable'  => DBResourceDataTableRequest::class
    ];

    public function __construct(Lesson $lesson)
    {
        $this->repository = new Repository($lesson);
    }

}
