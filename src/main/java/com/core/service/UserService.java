package com.core.service;

import com.core.domain.User;
import com.core.util.Constant;
import com.core.util.EncryptUtil;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by sun on 2017/4/19.
 */
@Service
public class UserService extends BaseService {

    /**
     * 查
     * @param id
     * @return
     */
    public User findUser(int id) {
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("id", id);

        List<User> list = list(User.class, " WHERE id = :id ", param);
        if (list == null || list.size() == 0) {
            return null;
        }
        return list.get(0);
    }

    public ObjectNode createAccount(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();

            objectNode.put("success", true);

            User account = findAccount(user.getAccount());
            if (account != null && account.getId() > 0) {
                objectNode.put("result", "exit");
                return objectNode;
            }

            /*user.setPassword(EncryptUtil.md5());
            user.setStatus(Constant.COMMON_STATUS_REJECT);
            // user is not manager
            user.setManager(Constant.USER_MANAGER_DEGRADE);
            user.setCreateDate(new Date());*/

            user.setId(baseRepository.create(user));

            // Log in to the database
            log("账户创建", user.toString());

            objectNode.put("result", "success");

            return objectNode;
        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }

    public User findAccount(String account) {

        Map<String, Object> param = new HashMap<String, Object>();
        param.put("account", account);

        List<User> list = list(User.class, " WHERE account = :account ", param);
        if (list == null || list.size() == 0) {
            return null;
        }
        return list.get(0);

    }

    public ObjectNode updateInfo(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();
            User userInfo = (User) request.getAttribute("user");
            User _user = new User();
            if (user.getId() > 0) {
                _user = find(User.class, userInfo.getId());
            }
            _user.setName(user.getName());
            _user.setPhone(user.getPhone());
            _user.setMail(user.getMail());
            _user.setDepict(user.getDepict());
            _user.setUpdateDate(new Date());
            if (user.getId() > 0) {
                // 更新
                baseRepository.update(_user);
            } else {
                _user.setPassword(EncryptUtil.md5(user.getPassword()));
                _user.setCreateDate(new Date());
                // 新增
                baseRepository.create(_user);
            }
            objectNode.put("result", "success");
            objectNode.put("success", true);
            return objectNode;

        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }

    public ObjectNode changePassWord(User user) {
        try {
            ObjectNode objectNode = objectMapper.createObjectNode();
            // 后台检查用户输入信息
            String result = "failed";
            boolean isCheck = true;
            int id = Integer.parseInt(request.getParameter("id"));
            String oldPassword = request.getParameter("old-password");
            String newPassword = request.getParameter("new-password");
            String rePassword = request.getParameter("re-password");
            if (StringUtils.isBlank(oldPassword)) {
                objectNode.put("password", "旧密码不能为空");
                isCheck = false;
            }
            if (StringUtils.isBlank(newPassword)) {
                objectNode.put("password", "新密码不能为空");
                isCheck = false;
            }
            if (StringUtils.isBlank(rePassword)) {
                objectNode.put("password", "密码确认不能为空");
                isCheck = false;
            }
            if (!EncryptUtil.md5(newPassword).equals(EncryptUtil.md5(rePassword))) {
                objectNode.put("password", "输入的两次新密码不相同,请重新输入");
                isCheck = false;
            }
            if (isCheck) {
                Map<String, Object> param = new HashMap<String, Object>();
                User _user = findUser(id);
                if (_user != null && _user.getId() > 0) {
                    if (!EncryptUtil.md5(oldPassword).equals(_user.getPassword())) {
                        objectNode.put("password", "旧密码验证错误，请重新输入");
                        isCheck = false;
                    }
                    if (EncryptUtil.md5(rePassword).equals(_user.getPassword())) {
                        objectNode.put("password", "新密码不能与旧密码相同，请重新输入");
                        isCheck = false;
                    }
                    if (isCheck) {
                        _user.setPassword(EncryptUtil.md5(rePassword));
                        baseRepository.update(_user);
                        result = "success";
                    }
                }
            }
            objectNode.put("result", result);
            objectNode.put("success", true);
            return objectNode;
        } catch (Exception e) {
            logger.error(e);
            throw new RuntimeException("");
        }
    }
}
