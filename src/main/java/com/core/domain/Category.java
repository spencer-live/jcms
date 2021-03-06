package com.core.domain;

import java.util.Date;

/**
 * Created by yk on 2017/4/24.
 */
public class Category {

    private long id;
    private String name;
    private String eName;
    private int parentId;
    private int tId;
    private int status;
    private Date createDate;
    private Date updateDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String geteName() {
        return eName;
    }

    public void seteName(String eName) {
        this.eName = eName;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public int gettId() {
        return tId;
    }

    public void settId(int tId) {
        this.tId = tId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", eName='" + eName + '\'' +
                ", parentId=" + parentId +
                ", tId=" + tId +
                ", status=" + status +
                ", createDate=" + createDate +
                ", updateDate=" + updateDate +
                '}';
    }
}
