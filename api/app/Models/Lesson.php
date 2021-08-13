<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Lesson extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'score'
    ];

    /**
     * Datatable columns
     *
     * @var object
     */

    public $columns = array(
        array(
            'id' => 0,
            'caption' => 'عنوان',
            'field' => 'title',
            'type' => 'label',
            'width' => 20,
            'searchable' => true,
            'sortable' => true
        ),
        array(
            'id' => 2,
            'caption' => 'نمره',
            'field' => 'score',
            'type' => 'label',
            'width' => 20,
        ),
        array(
            'id' => 3,
            'caption' => 'وضعیت',
            'field' => 'active',
            'width' => 20,
            'controlType' => 'CheckBox'
        ),
    );

}
