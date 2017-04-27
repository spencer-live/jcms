Ext.define('Admin.controller.ViewController', {
    extend: 'Ext.app.ViewController',

    config: {
        // url: '', // 子控制器赋值
        searchPrefix: 'search-',
        searchGridSuffix: '-mgrid'
    },

    getContentPanel: function () {
        return Admin.app.getController('AppController').getContentPanel();
    },

    /**
     * searchpanel - 查询
     */
    onSearchPanelQuery: function () {
        var ctrl = this,
            view = ctrl.getView(),

            searchPrefix = ctrl.getSearchPrefix(),
            searchGridSuffix = ctrl.getSearchGridSuffix(),
            searchComs = view.query('[itemId^=' + searchPrefix + ']');

        var grid = view.down(view.xtype + searchGridSuffix),
            store = grid.getStore();

        var filters = [];

        Ext.each(searchComs, function (item, index, allItems) {
            var key = item.itemId.slice(searchPrefix.length),
                value = item.getValue();

            if (value && typeof value === 'string') {
                value = value.indexOf('全部') > -1 ? '' : value;
            }

            filters.push({
                property: key,
                value: value
            });
        });

        store.setFilters(filters);

    },

    /**
     * searchpanel - 重置
     */
    onSearchPanelReset: function () {
        var ctrl = this,
            view = ctrl.getView(),

            searchPrefix = ctrl.getSearchPrefix(),
            searchGridSuffix = ctrl.getSearchGridSuffix(),
            searchComs = view.query('[itemId^=' + searchPrefix + ']');

        var grid = view.down(view.xtype + searchGridSuffix),
            store = grid.getStore();

        Ext.each(searchComs, function (item, index, allItems) {
            item.setValue('');
        });


        store.clearFilter();
    },

    /**
     * form submit
     * @param form
     * @param formCfg
     * @param callback
     */
    formSubmit: function (form, formCfg, callback) {
        var cfg = Ext.apply({
            submitEmptyText: false, // 不发送空值,默认会发送
            url: '',
            waitMsgTarget: true,
            waitTitle: '请稍候...',
            success: callback, // 回调交给各自调用者处理
            failure: Ext.ux.formFailure
        }, formCfg);

        form.submit(cfg);
    },
    /**
     * 用于只发送id ids的操作
     * @param action
     * @param text
     * @param grid
     * @param ajaxCfg
     */
    sendAjaxFromIds: function (action, text, grid, ajaxCfg) {
        if (!action) {
            Ext.log('缺少action');
            return;
        }

        var ids = [];

        Ext.each(grid.getSelection(), function (item, index, allItems) {

            if (item.id !== 0) {
                ids.push(item.id);
            }
        });

        if (ids.length == 0) return;

        var cfg = Ext.apply({
            url: '',
            params: {
                method: action,
                ids: ids
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var success = obj['success'],
                    msg = obj['msg'];

                if (success) {
                    Ext.ux.Msg.info(text + '成功', function () {
                        // 不需要重置pageNo
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                } else {
                    Ext.ux.Msg.ajaxFailure(response, opts);
                }
            },
            failure: Ext.ux.Msg.ajaxFailure
        }, ajaxCfg);

        Ext.MessageBox.confirm('提示', '共选中【' + ids.length + '】项，确定要【' + text + '】吗？', function (result) {
            if (result === 'no') return;

            Ext.Ajax.request(cfg);
        });

    },

    /**
     * 用于单元格修改数据
     * @param action
     * @param text
     * @param grid
     * @param ajaxCfg
     */
    sendAjaxFromData: function (action, text, grid, ajaxCfg) {
        if (!action) {
            Ext.log('缺少action');
            return;
        }

        var data = [];

        Ext.each(grid.getSelection(), function (item, index, allItems) {
            if (item.dirty) {
                data.push(item.data);
            }
        });

        if (data.length == 0) return;


        var cfg = Ext.apply({
            url: '',
            params: {
                method: action,
                data: Ext.util.JSON.encode(data)
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);

                var success = obj['success'],
                    msg = obj['msg'];

                if (success) {
                    Ext.ux.Msg.info(text + '成功', function () {
                        // 不需要重置pageNo
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                } else {
                    Ext.ux.Msg.ajaxFailure(response, opts);
                }
            },
            failure: Ext.ux.Msg.ajaxFailure
        }, ajaxCfg);

        Ext.MessageBox.confirm('提示', '共选中【' + data.length + '】项，确定要【' + text + '】吗？', function (result) {
            if (result === 'no') return;

            Ext.Ajax.request(cfg);
        });

    },

    /**
     * 按钮点击 - 刷新 grid store
     * @param button
     */
    onRefreshBtnClicked: function (button) {

        // 重置分页
        var grid = button.up('grid'),
            store = button.up('grid').getStore();

        store.getProxy().setExtraParam('page', 1);
        store.reload();

        grid.getSelectionModel().deselectAll();
    },

    /**
     * common - 表单重置
     * @param button
     */
    onResetBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        view.down('form').reset();
    },


    /* temp function */
    onBtnClicked: function (button) {
        Ext.log(button.text);
    }


});