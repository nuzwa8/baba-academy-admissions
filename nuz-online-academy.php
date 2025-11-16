<?php
/**
 * Plugin Name: NUZ Online Academy
 * Plugin URI: https://nuzonline.com/academy
 * Description: Complete Learning Management System for Online Academy with Course Management, Student Records, Fee Tracking, and Screenshot Upload Features.
 * Version: 1.0.0
 * Author: NUZ Online Academy
 * License: GPL v2 or later
 * Text Domain: nuz-online-academy
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('NUZ_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NUZ_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('NUZ_PLUGIN_VERSION', '1.0.0');
define('NUZ_PLUGIN_SLUG', 'nuz-online-academy');

/**
 * Main Plugin Class
 * 
 * @package NuzOnlineAcademy
 * @since 1.0.0
 */
class NUZ_Online_Academy {
    
    /**
     * Single instance of the class
     */
    private static $instance = null;
    
    /**
     * Get single instance
     */
    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
        $this->include_files();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        register_activation_hook(__FILE__, array('NUZ_Activator', 'activate'));
        register_deactivation_hook(__FILE__, array('NUZ_Activator', 'deactivate'));
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'admin_scripts'));
        add_action('wp_ajax_nuz_dashboard_stats', array('NUZ_Ajax', 'get_dashboard_stats'));
        add_action('wp_ajax_nuz_get_recent_admissions', array('NUZ_Ajax', 'get_recent_admissions'));
        add_action('wp_ajax_nuz_get_upcoming_courses', array('NUZ_Ajax', 'get_upcoming_courses'));
        add_action('wp_ajax_nuz_get_monthly_enrollment_data', array('NUZ_Ajax', 'get_monthly_enrollment_data'));
        add_action('wp_ajax_nuz_export_dashboard_data', array('NUZ_Ajax', 'export_dashboard_data'));
        add_action('wp_ajax_nuz_add_student', array('NUZ_Ajax', 'add_student'));
        add_action('wp_ajax_nuz_get_students', array('NUZ_Ajax', 'get_students'));
        add_action('wp_ajax_nuz_upload_screenshot', array('NUZ_Ajax', 'upload_screenshot'));
        add_action('wp_ajax_nuz_export_students', array('NUZ_Ajax', 'export_students'));
        add_action('wp_ajax_nuz_update_settings', array('NUZ_Ajax', 'update_settings'));
    }
    
    /**
     * Include required files
     */
    private function include_files() {
        require_once NUZ_PLUGIN_PATH . 'class-nuz-activator.php';
        require_once NUZ_PLUGIN_PATH . 'class-nuz-ajax.php';
        require_once NUZ_PLUGIN_PATH . 'class-nuz-assets.php';
        require_once NUZ_PLUGIN_PATH . 'class-nuz-db.php';
        
        // Initialize AJAX handlers
        NUZ_Ajax::init();
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        load_plugin_textdomain('nuz-online-academy', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        // Main menu
        add_menu_page(
            __('NUZ Academy', 'nuz-online-academy'),
            __('NUZ Academy', 'nuz-online-academy'),
            'manage_options',
            'nuz-online-academy',
            array($this, 'dashboard_page'),
            'dashicons-graduation-cap',
            30
        );
        
        // Sub menu items
        add_submenu_page(
            'nuz-online-academy',
            __('Dashboard', 'nuz-online-academy'),
            __('Dashboard', 'nuz-online-academy'),
            'manage_options',
            'nuz-online-academy',
            array($this, 'dashboard_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('Courses', 'nuz-online-academy'),
            __('Courses', 'nuz-online-academy'),
            'manage_options',
            'nuz-courses',
            array($this, 'courses_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('Students', 'nuz-online-academy'),
            __('Students', 'nuz-online-academy'),
            'manage_options',
            'nuz-students',
            array($this, 'students_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('Fee Management', 'nuz-online-academy'),
            __('Fee Management', 'nuz-online-academy'),
            'manage_options',
            'nuz-fees',
            array($this, 'fees_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('New Admission', 'nuz-online-academy'),
            __('New Admission', 'nuz-online-academy'),
            'manage_options',
            'nuz-new-admission',
            array($this, 'new_admission_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('Uploads', 'nuz-online-academy'),
            __('Uploads', 'nuz-online-academy'),
            'manage_options',
            'nuz-uploads',
            array($this, 'uploads_page')
        );
        
        add_submenu_page(
            'nuz-online-academy',
            __('Settings', 'nuz-online-academy'),
            __('Settings', 'nuz-online-academy'),
            'manage_options',
            'nuz-settings',
            array($this, 'settings_page')
        );
    }
    
    /**
     * Dashboard page
     */
    public function dashboard_page() {
        echo '<div id="nuz-dashboard-root"></div>';
        $this->include_dashboard_template();
    }
    
    /**
     * Courses page
     */
    public function courses_page() {
        echo '<div id="nuz-courses-root"></div>';
        $this->include_courses_template();
    }
    
    /**
     * Students page
     */
    public function students_page() {
        echo '<div id="nuz-students-root"></div>';
        $this->include_students_template();
    }
    
    /**
     * Fees page
     */
    public function fees_page() {
        echo '<div id="nuz-fees-root"></div>';
        $this->include_fees_template();
    }
    
    /**
     * New admission page
     */
    public function new_admission_page() {
        echo '<div id="nuz-new-admission-root"></div>';
        $this->include_new_admission_template();
    }
    
    /**
     * Uploads page
     */
    public function uploads_page() {
        echo '<div id="nuz-uploads-root"></div>';
        $this->include_uploads_template();
    }
    
    /**
     * Settings page
     */
    public function settings_page() {
        echo '<div id="nuz-settings-root"></div>';
        $this->include_settings_template();
    }
    
    /**
     * Include page templates
     */
    private function include_dashboard_template() {
        if (file_exists(NUZ_PLUGIN_PATH . 'dashboard.php')) {
            include NUZ_PLUGIN_PATH . 'dashboard.php';
        }
    }
    
    private function include_courses_template() {
        // Courses template will be loaded via AJAX
    }
    
    private function include_students_template() {
        // Students template will be loaded via AJAX
    }
    
    private function include_fees_template() {
        // Fees template will be loaded via AJAX
    }
    
    private function include_new_admission_template() {
        // New admission template will be loaded via AJAX
    }
    
    private function include_uploads_template() {
        // Uploads template will be loaded via AJAX
    }
    
    private function include_settings_template() {
        // Settings template will be loaded via AJAX
    }
    
    /**
     * Enqueue admin scripts and styles
     */
    public function admin_scripts($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'nuz-') === false) {
            return;
        }
        
        // Check if we're on the dashboard page
        $is_dashboard = isset($_GET['page']) && $_GET['page'] === 'nuz-online-academy';
        
        wp_enqueue_script('nuz-online-academy', NUZ_PLUGIN_URL . 'nuz-online-academy.js', array('jquery'), NUZ_PLUGIN_VERSION, true);
        wp_enqueue_script('nuz-common', NUZ_PLUGIN_URL . 'nuz-common.js', array('jquery'), NUZ_PLUGIN_VERSION, true);
        wp_enqueue_script('nuz-chart', NUZ_PLUGIN_URL . 'vendor/chart.min.js', array(), NUZ_PLUGIN_VERSION, true);
        wp_enqueue_script('nuz-fullcalendar', NUZ_PLUGIN_URL . 'vendor/fullcalendar.min.js', array(), NUZ_PLUGIN_VERSION, true);
        wp_enqueue_script('nuz-html2pdf', NUZ_PLUGIN_URL . 'vendor/html2pdf.min.js', array(), NUZ_PLUGIN_VERSION, true);
        
        // Dashboard specific scripts
        if ($is_dashboard) {
            wp_enqueue_script('nuz-dashboard', NUZ_PLUGIN_URL . 'dashboard.js', array('jquery', 'nuz-online-academy'), NUZ_PLUGIN_VERSION, true);
        }
        
        wp_enqueue_style('nuz-online-academy', NUZ_PLUGIN_URL . 'nuz-online-academy.css', array(), NUZ_PLUGIN_VERSION);
        wp_enqueue_style('nuz-common', NUZ_PLUGIN_URL . 'nuz-common.css', array(), NUZ_PLUGIN_VERSION);
        
        // Dashboard specific styles
        if ($is_dashboard) {
            wp_enqueue_style('nuz-dashboard', NUZ_PLUGIN_URL . 'dashboard.css', array('nuz-online-academy'), NUZ_PLUGIN_VERSION);
        }
        
        // Localize script
        wp_localize_script('nuz-online-academy', 'nuz_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('nuz_nonce'),
            'plugin_url' => NUZ_PLUGIN_URL,
            'strings' => array(
                'loading' => __('Loading...', 'nuz-online-academy'),
                'error' => __('Error occurred', 'nuz-online-academy'),
                'success' => __('Success', 'nuz-online-academy'),
                'confirm_delete' => __('Are you sure you want to delete this item?', 'nuz-online-academy'),
                'required_field' => __('This field is required', 'nuz-online-academy'),
                'invalid_email' => __('Please enter a valid email address', 'nuz-online-academy')
            )
        ));
    }
}

// Initialize the plugin
function nuz_online_academy() {
    return NUZ_Online_Academy::get_instance();
}

// Start the plugin
nuz_online_academy();

/**
 * Plugin activation
 */
function nuz_online_academy_activate() {
    NUZ_Activator::activate();
}
register_activation_hook(__FILE__, 'nuz_online_academy_activate');

/**
 * Plugin deactivation
 */
function nuz_online_academy_deactivate() {
    NUZ_Activator::deactivate();
}
register_activation_hook(__FILE__, 'nuz_online_academy_deactivate');