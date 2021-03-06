Ext.define('Admin.view.content.headline.text.TextController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-headline-text',

    module: 'content-headline-text',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        'content-headline-text-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'content-headline-text-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'content-headline-text-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'content-headline-text-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'content-headline-text-mgrid button[action=content-headline-picture]': {
            click: 'onPictureHeadLineBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // text
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        view.down('button[action=save]').setDisabled(count < 1);
        view.down('button[action=delete]').setDisabled(count < 1);
    },

    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

    onPictureHeadLineBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),// text-mgrid

            ownerView = view.up().up(),// content
            ownerCtrl = ownerView.getController(), // content

            category = ownerView.id.split('-'),
            category = category[category.length-1],

            winReference = 'content-headline-picture-win-' + category;

        view.up().hide(); // 关闭当前窗口,再打开新窗口

        var win = ownerCtrl.lookupReference(winReference);

        if (!win) {
            win = Ext.create({
                xtype: 'headlinewindow',
                reference: winReference,

                viewModel: {
                    data: {
                        category: category,
                        categoryName: ownerView.getTitle(),
                        subItem: 'content-headline-picture-mgrid',
                        type: 'picture'
                    }
                }
            });

            ownerView.add(win);
        }

        win.show();
    },

    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView(),

            ownerView = view.up();// content


        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: 'data/ajax.json' // todo edit
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();

                var grid = ownerView.down('grid'),
                    store = grid.getStore();

                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    }

});
