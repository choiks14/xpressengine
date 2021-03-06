<?php
/**
 * @author    XE Developers <developers@xpressengine.com>
 * @copyright 2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license   http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link      https://xpressengine.io
 */

namespace Xpressengine\Migrations;

use Illuminate\Database\Schema\Blueprint;
use Schema;
use Xpressengine\Support\Migration;

class RoutingMigration implements Migration {

    public function install()
    {
        Schema::create('instance_route', function (Blueprint $table) {
            $table->engine = "InnoDB";

            $table->increments('id');
            $table->string('url');
            $table->string('module');
            $table->string('instanceId');
            $table->string('menuId');
            $table->string('siteKey');

            $table->unique('instanceId');
        });
    }

    public function update($installedVersion = null)
    {

    }

    public function checkInstalled()
    {
    }

    public function checkUpdated($installedVersion = null)
    {
    }
}
