<?php
/**
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */

namespace App\UIObjects\Lang;

use XeFrontend;
use Config;
use Xpressengine\UIObject\AbstractUIObject;

class LangText extends AbstractUIObject
{
    protected static $id = 'uiobject/xpressengine@langText';

    public function render()
    {
        $args = $this->arguments;

        XeFrontend::js(
            [
                '/assets/vendor/jqueryui/jquery-ui.js',
                '/assets/vendor/expanding/expanding.js',
                '/assets/core/lang/LangEditorBox.bundle.js'
            ]
        )->load();

        XeFrontend::css(
            [
                '/assets/vendor/jqueryui/jquery-ui.css',
                '/assets/core/lang/LangEditorBox.css',
                '/assets/core/xe-ui-component/xe-ui-component.css'
            ]
        )->load();

        $langKey = htmlspecialchars($args['langKey'], ENT_QUOTES, 'UTF-8');
        $autocomplete = Config::get('xe.lang.autocomplete');

        return "<div class=\"lang-editor-box\""
            . " data-name=\"{$args['name']}\""
            . " data-lang-key=\"{$langKey}\""
            . " data-autocomplete=\"{$autocomplete}\"></div>";
    }

    public static function boot()
    {
    }

    public static function getSettingsURI()
    {
    }
}
