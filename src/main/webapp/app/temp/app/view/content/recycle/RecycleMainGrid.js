Ext.define('Admin.view.content.recycle.RecycleMainGrid', {
    extend: 'Admin.view.common.panel.BaseGridPanel',
    xtype: 'content-recycle-mgrid',

    initComponent: function () {
        var me = this;


        Ext.apply(me, {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'ajax',
                    url: 'data/news.json',
                    reader: {
                        type: 'json',
                        rootProperty: 'rows'
                    }
                },
                autoLoad: true
            }),
            columns: [
                // todo edit {dataIndex}

                {text: 'ID', dataIndex: 'id', width: 80},
                {text: '状态', dataIndex: 'status', renderer: me.renderer, width: 80},
                {text: '标题', dataIndex: 'title', renderer: me.renderer, flex: 1},
                {text: '栏目', dataIndex: 'category', width: 150},
                {text: '作者', dataIndex: 'author'},
                {text: '创建人', dataIndex: 'creator'},
                {text: '头条', dataIndex: 'headlineArticle', renderer: me.renderer},
                {text: '图片', dataIndex: 'headlinePic', renderer: me.renderer},
                {text: '创建时间', dataIndex: 'createDate', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150},
                {text: '更新时间', dataIndex: 'lastChange', xtype: 'datecolumn', format: 'y-m-d H:i:s', width: 150}
            ],
            tbar: [

                {
                    xtype: 'button',
                    text: '还原',
                    iconCls: 'x-fa fa-undo',
                    disabled: true,
                    action: 'restore'
                },
                '-',
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'x-fa fa-refresh',
                    action: 'refresh'
                },
                '-',
                {
                    xtype: 'component',
                    reference: 'status',
                    style: {
                        'color': 'crimson'
                    }
                }

            ]
        });

        me.callParent();
    },
    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch (dataIndex) {
            case 'status':
                switch (value) {
                    case 0:
                        metaData.tdStyle = 'color:#0066FF';
                        return '初稿';
                    case 1:
                        metaData.tdStyle = 'color:blank';
                        return '已签';
                    case 5:
                        metaData.tdStyle = 'color:#FF6633';
                        return '返工';
                    case 9:
                        metaData.tdStyle = 'color:blank';
                        return '已发';
                    case 10:
                        metaData.tdStyle = 'color:red';
                        return '已删';
                }
            case 'headlineArticle':
                switch (value) {
                    case 1:
                        return '<button class="x-fa fa-flag admin-label-button admin-color-purple" action="set-text-headline"></button>';
                    case 0:
                        return '<button class="x-fa fa-flag admin-label-button admin-color-gray" action="cancel-text-headline"></button>';
                }
            case 'headlinePic':
                switch (value) {
                    case 2:
                        return '<button class="x-fa fa-picture-o admin-label-button admin-color-purple" action="set-picture-headline"></button>';
                    case 0:
                        return '<button class="x-fa fa-picture-o admin-label-button admin-color-gray" action="cancel-picture-headline"></button>';
                }
            case 'title':
                //return '<a href=""/>'; // todo edit
                return value;
            default:
                return value;
        }
    }
});
