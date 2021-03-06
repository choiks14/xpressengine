<?php
/**
 * @author    XE Developers <developers@xpressengine.com>
 * @copyright 2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license   http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link      https://xpressengine.io
 */

namespace Xpressengine\Migrations;

use Xpressengine\Editor\EditorHandler;
use Xpressengine\Permission\Grant;
use Xpressengine\Support\Migration;
use Xpressengine\User\Rating;

class EditorMigration implements Migration
{

    /**
     * checkInstall
     *
     * @return mixed
     */
    public function checkInstalled()
    {
        // TODO: Implement checkInstalled() method.
    }

    /**
     * install
     *
     * @return mixed
     */
    public function install()
    {
        // TODO: Implement install() method.
    }

    /**
     * checkUpdate
     *
     * @param string $installedVersion current version
     *
     * @return mixed
     */
    public function checkUpdated($installedVersion = null)
    {
        // TODO: Implement checkUpdated() method.
    }

    /**
     * update
     *
     * @param string $installedVersion current version
     *
     * @return mixed
     */
    public function update($installedVersion = null)
    {
        // TODO: Implement update() method.
    }

    public function init()
    {
        app('xe.config')->set(EditorHandler::CONFIG_NAME, [
            'height' => 400,
            'fontSize' => '14px',
            'fontFamily' => null,
            'uploadActive' => true,
            'fileMaxSize' => 2,
            'attachMaxSize' => 10,
            'extensions' => '*',
            'tools' => []
        ]);

        $data = [
            Grant::RATING_TYPE => Rating::MEMBER,
            Grant::GROUP_TYPE => [],
            Grant::USER_TYPE => [],
            Grant::EXCEPT_TYPE => [],
            Grant::VGROUP_TYPE => [],
        ];

        $grant = new Grant();
        $grant->set('html', $data);
        $grant->set('tool', $data);
        $grant->set('upload', $data);
        $grant->set('download', $data);
        app('xe.permission')->register(EditorHandler::CONFIG_NAME, $grant);
    }
}
