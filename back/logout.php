<?php
session_start();
session_destroy();
header("Location: /proj_appweb/front/login.html");

?>