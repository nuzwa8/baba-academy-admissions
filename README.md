# NUZ Online Academy - WordPress Plugin

A complete Learning Management System (LMS) plugin for WordPress featuring course management, student records, fee tracking, and screenshot upload functionality.

## 🎯 Features

### 🎓 Core Learning Management Features
- **Course Management**: Create and manage courses (Video Editing, Web Design, Copywriting, etc.)
- **Student Management**: Complete student registration and profile management
- **Fee Tracking**: Payment management with status tracking (Paid, Pending, Overdue)
- **Enrollment System**: Student enrollment with progress tracking
- **Screenshot Upload**: Face and work screenshots for student verification
- **Certificate Generation**: Automated certificate creation upon completion

### 🎨 Design & User Experience
- **Multi-Color Beautiful Design**: Attractive, modern interface
- **Light/Dark Mode**: Theme switching support
- **Mobile Responsive**: Fully responsive design for all devices
- **Interactive UI**: Smooth animations and transitions
- **Print & Export**: PDF export and Excel download functionality

### 🔧 Administrative Features
- **Admin Panel**: Complete control dashboard
- **Settings Management**: Logo upload, theme selection, language options
- **Data Import/Export**: CSV import and export capabilities
- **Role Management**: Different user roles (Admin, Instructor, Student)
- **Audit Trail**: Activity logging and reporting

### 📊 Analytics & Reporting
- **Dashboard Statistics**: Real-time academy statistics
- **Chart Visualizations**: Revenue and enrollment charts
- **Payment Reports**: Detailed payment tracking and summaries
- **Student Performance**: Individual student progress monitoring

## 🛠️ Installation

1. **Upload Plugin Files**
   ```
   Upload the 'nuz-online-academy' folder to wp-content/plugins/
   ```

2. **Activate Plugin**
   - Go to WordPress Admin → Plugins
   - Find "NUZ Online Academy"
   - Click "Activate"

3. **Initial Setup**
   - Plugin will automatically create database tables
   - Demo data will be inserted for testing
   - User roles and capabilities will be configured

## 📁 File Structure

```
wp-content/plugins/nuz-online-academy/
├── nuz-online-academy.php          # Main plugin file
├── nuz-online-academy.js           # Core JavaScript
├── nuz-online-academy.css          # Main stylesheet
├── uninstall.php                   # Uninstall cleanup
├── class-nuz-activator.php         # Activation & database setup
├── class-nuz-ajax.php             # AJAX request handler
├── class-nuz-assets.php           # Assets loader
├── class-nuz-db.php               # Database utilities
├── nuz-common.js                  # Shared JavaScript utilities
├── nuz-common.css                 # Shared CSS styles
└── vendor/                        # Third-party libraries
    ├── chart.min.js               # Chart.js library
    ├── fullcalendar.min.js        # Calendar functionality
    └── html2pdf.min.js            # PDF generation
```

## 🗄️ Database Tables

The plugin creates the following tables:

### Students Table (`nuz_students`)
- Student ID, name, email, phone
- Address, course enrollment
- Admission date, status
- Profile image, notes

### Courses Table (`nuz_courses`)
- Course code, name, description
- Instructor, duration, price
- Start/end dates, status
- Syllabus URL, thumbnail

### Payments Table (`nuz_payments`)
- Student/course relationships
- Payment amount, date, method
- Status (paid, pending, overdue)
- Reference numbers, notes

### Enrollments Table (`nuz_enrollments`)
- Student-course enrollments
- Enrollment/completion dates
- Progress percentage, grades
- Certificate URLs

### Screenshots Table (`nuz_screenshots`)
- Student screenshot storage
- File paths and types
- Verification status
- Upload dates and descriptions

### Settings Table (`nuz_settings`)
- Plugin configuration
- Theme preferences
- Academy information
- System preferences

## 🔌 Usage

### Getting Started

1. **Dashboard Access**
   - Navigate to "NUZ Academy" in WordPress admin menu
   - View overall statistics and recent activity

2. **Student Management**
   - Add new students via "New Admission"
   - Manage existing students in "Students" section
   - Upload student screenshots for verification

3. **Course Management**
   - Create and edit courses
   - Set pricing and schedules
   - Track enrollment numbers

4. **Fee Management**
   - Record payments and track status
   - Generate payment reports
   - Send payment reminders

### Key Features

#### Student Registration
- Automated student ID generation
- Course enrollment during registration
- Automatic enrollment record creation

#### Payment Tracking
- Multiple payment methods support
- Payment status management
- Automated calculations

#### Screenshot Management
- Face and work screenshot upload
- Drag-and-drop file upload
- Screenshot verification system

#### Data Export/Import
- Excel export for all data
- CSV import functionality
- PDF report generation

#### Theme Management
- Light/Dark mode toggle
- Custom logo upload
- Color scheme customization

## 🎨 Customization

### CSS Variables
The plugin uses CSS custom properties for easy theming:

```css
:root {
  --nuz-primary: #4f46e5;
  --nuz-secondary: #10b981;
  --nuz-accent: #f59e0b;
  /* ... more variables */
}
```

### Theme Switching
- Light mode (default)
- Dark mode (automatic detection)
- Custom theme support

### Logo Management
- Upload custom academy logo
- Logo size optimization
- Automatic placeholder handling

## 🔧 Settings Configuration

### Basic Settings
- Academy name
- Contact information
- Currency symbol
- Maximum upload size

### Theme Settings
- Theme mode selection
- Primary color customization
- Logo management

### System Settings
- Auto backup options
- Email notifications
- SMS integration (future)

## 📱 Responsive Design

The plugin is fully responsive with breakpoints for:
- Mobile phones (< 480px)
- Tablets (480px - 768px)
- Desktop (> 768px)

## 🔒 Security Features

### Data Protection
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF token validation

### User Permissions
- Role-based access control
- Capability verification
- Admin-only sensitive operations

### File Upload Security
- File type validation
- Size restrictions
- Secure file storage
- Malicious file detection

## 🚀 Performance Optimizations

### Loading Performance
- Minified CSS/JS files
- Lazy loading for large datasets
- Optimized database queries
- Caching mechanisms

### Database Optimization
- Indexed columns for fast queries
- Efficient JOIN operations
- Pagination for large datasets
- Query optimization

## 📊 API Endpoints

The plugin provides REST API endpoints for:

### Student Operations
- `GET /wp-json/nuz/v1/students` - List all students
- `POST /wp-json/nuz/v1/students` - Create new student
- `PUT /wp-json/nuz/v1/students/{id}` - Update student
- `DELETE /wp-json/nuz/v1/students/{id}` - Delete student

### Course Operations
- `GET /wp-json/nuz/v1/courses` - List all courses
- `POST /wp-json/nuz/v1/courses` - Create new course
- `PUT /wp-json/nuz/v1/courses/{id}` - Update course

### Payment Operations
- `GET /wp-json/nuz/v1/payments` - List all payments
- `POST /wp-json/nuz/v1/payments` - Record new payment

## 🔧 Development

### Adding New Features

1. **Database Changes**
   - Update `class-nuz-activator.php`
   - Add migration logic
   - Update database version

2. **Frontend Components**
   - Add HTML templates
   - Create corresponding CSS
   - Implement JavaScript functionality

3. **Backend Logic**
   - Add AJAX handlers
   - Update database utilities
   - Add new admin pages

### Hooks & Filters

#### Actions
```php
// Student created
do_action('nuz_student_created', $student_id, $student_data);

// Payment recorded
do_action('nuz_payment_recorded', $payment_id, $payment_data);

// Course enrollment
do_action('nuz_course_enrolled', $enrollment_id, $enrollment_data);
```

#### Filters
```php
// Modify student data before save
$student_data = apply_filters('nuz_before_student_save', $student_data);

// Customize email templates
$email_content = apply_filters('nuz_email_template', $content, $type);
```

## 🧪 Testing

### Automated Testing
- Unit tests for database operations
- Integration tests for AJAX handlers
- Frontend tests for UI components

### Manual Testing Checklist
- [ ] Student registration flow
- [ ] Payment recording
- [ ] Screenshot upload
- [ ] Export functionality
- [ ] Theme switching
- [ ] Mobile responsiveness

## 📋 Troubleshooting

### Common Issues

#### Plugin Not Activating
- Check PHP version (7.4+ required)
- Verify WordPress version (5.0+)
- Check file permissions

#### Database Errors
- Ensure database user has CREATE TABLE privileges
- Check for conflicting table names
- Verify WordPress database prefix

#### File Upload Issues
- Check upload limits in wp-config.php
- Verify file permissions
- Check for memory limit issues

#### Performance Issues
- Enable object caching
- Optimize database queries
- Use CDN for assets

### Debug Mode
Enable WordPress debug mode in wp-config.php:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## 📞 Support

### Documentation
- Complete API documentation
- Code examples and tutorials
- Video guides for setup

### Getting Help
- Check troubleshooting guide
- Review code documentation
- Contact support team

## 📝 License

This plugin is licensed under the GPL v2 or later.

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- Complete LMS functionality
- Student management system
- Course management
- Payment tracking
- Screenshot upload system
- Responsive design
- Dark/light theme support
- Data export/import
- PDF generation
- Multi-language support

## 🚀 Future Enhancements

### Planned Features
- SMS notifications
- Email integration
- Advanced analytics
- Mobile app support
- API documentation
- Third-party integrations

### Performance Improvements
- Database optimization
- Caching enhancements
- CDN integration
- Lazy loading improvements

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 Credits

Developed by **MiniMax Agent** for NUZ Online Academy

### Technologies Used
- WordPress Plugin API
- PHP 7.4+
- JavaScript (ES6+)
- CSS3 with Flexbox/Grid
- Chart.js for visualizations
- FullCalendar for scheduling
- html2pdf for document generation

---

**Thank you for using NUZ Online Academy!** 🎓

For more information, documentation, and support, please visit our website or contact our support team.