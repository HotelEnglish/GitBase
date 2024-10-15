---
title: 记一次忘记WORDPRESS 管理员密码的恢复
description: '试了90%的忘记密码的方法,都未能解决'
date: '2024-10-15T02:25:45.750Z'
---
由于Edge浏览器过于“智能”的密码管理功能，把我保存的复杂密码给替换了，导致一直进不去后台。

网上流传着8种解决忘记管理员密码的方法，但是对我的这种情况都不适用，不知道是哪里出了问题，总之是都没有成功。

特别想提一下的是修改数据库里管理员的密码那个方法，以前是管用的，但不知道为什么现在就不管用了。

最后想起来好久以前无意中看到的有一个可以通过新建一个重置密码的PHP文件来重置密码的帖子，于是上网搜索到了一段代码，一看是2016年的帖子了。

考虑到现在WORDPRESS 已经更新到6.6.x 了，这段代码大概率不能很好地运行了，所以就让CLAUDE优化了一下，结果完美运行 。

## 旧的代码：
```

<?php //password resetter include("wp-config.php"); include("wp-blog-header.php"); if (empty($_POST)) { ?> <form method="post"> set admin password: <input name="emergency_pass" type="password" /> <input type="submit" /> </form> <?php } else { $sql = "UPDATE ".$wpdb->users." SET user_pass = '".md5($_POST)."' WHERE User_login = 'admin'"; $link = $wpdb->query($sql); wp_redirect('wp-login.php'); exit(); } ?>
```
## 提示词：
```
以下是一个较老的使用 PHP代码 找回WORDPRESS管理员密码的代码,但是可能存在语法问题,或与最新版的WORDPRESS 6.4不兼容.请为我优化调整,确保能完美使用.
```
## CLAUDE 修改后的代码：
```
<?php
// WordPress Admin Password Reset Script

// Ensure this script is being run in the WordPress environment
define('WP_USE_THEMES', false);
require_once('wp-load.php');

// Check if the user is already logged in
if (is_user_logged_in()) {
    wp_die('You are already logged in. Please log out to use this script.');
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['emergency_pass']) || empty($_POST['emergency_pass'])) {
        wp_die('Password cannot be empty.');
    }

    // Verify nonce for security
    if (!isset($_POST['security_nonce']) || !wp_verify_nonce($_POST['security_nonce'], 'reset_admin_password')) {
        wp_die('Security check failed.');
    }

    $new_password = $_POST['emergency_pass'];
    $user = get_user_by('login', 'admin');

    if (!$user) {
        wp_die('Admin user not found.');
    }

    // Update the password
    wp_set_password($new_password, $user->ID);

    // Redirect to login page
    wp_redirect(wp_login_url());
    exit;
} else {
    // Display the form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Admin Password</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
            form { display: flex; flex-direction: column; }
            input[type="password"], input[type="submit"] { margin: 10px 0; padding: 5px; }
        </style>
    </head>
    <body>
        <h2>Reset Admin Password</h2>
        <form method="post">
            <label for="emergency_pass">Set new admin password:</label>
            <input id="emergency_pass" name="emergency_pass" type="password" required />
            <?php wp_nonce_field('reset_admin_password', 'security_nonce'); ?>
            <input type="submit" value="Reset Password" />
        </form>
    </body>
    </html>
    <?php
}
?>
```
