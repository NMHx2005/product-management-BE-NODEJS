// Import module Express vào biến express. Là một framework cho Nodejs, giúp xây dựng ứng dụng web và API một cách nhanh chóng.
const express = require("express")





// Import module dotnev và gọi phương thức config để có thể sử dụng các biến môi trường được định nghĩa trong file .env
require('dotenv').config();
const bodyParser = require('body-parser');

const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');



// Khai báo một hằng số PORT và gán giá trị 3000 cho nó. Đây là cổng mặc định mà server sẽ lắng nghe.
const PORT = 3000;

//  Import module cấu hình cơ sở dữ liệu từ file database.js trong thư mục config.
const database = require("./config/database");
// Gọi phương thức connect() từ module cơ sở dữ liệu đã import để kết nối với cơ sở dữ liệu.
database.connect();

// Import các route cho client từ file index.route.js trong thư mục routes/client.
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

// Khởi tạo một instance của Express và gán vào biến app.
const app = express();
// Lấy giá trị của biến môi trường PORT và gán vào biến port. Nếu không có giá trị nào được set, server sẽ lắng nghe ở cổng được định nghĩa bởi hằng số PORT (3000).
const port = process.env.PORT;


// Flash
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash


// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Cấu hình thư mục chứa các file template view cho Express.
app.set("views", "./views");
// Cấu hình Express để sử dụng Pug làm template engine.
app.set("view engine", "pug");

// Cấu hình Express để phục vụ các file tĩnh (như CSS, JavaScript, images) từ thư mục public.
app.use(express.static('public'));


// Tạo biến toàn cục cho file pug


//  Gọi phương thức index() từ module route client đã import, truyền vào instance của Express (app) để định nghĩa các route cho client.
routeClient.index(app);
routeAdmin.index(app);

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Khởi động server và lắng nghe ở cổng được chỉ định bởi biến port. Khi server bắt đầu lắng nghe, nó sẽ in ra thông báo "Example app listening at http://localhost
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});