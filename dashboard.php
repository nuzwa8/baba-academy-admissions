<?php
/**
 * Dashboard Page Template
 * NUZ Online Academy Plugin
 * 
 * @package NUZ_Online_Academy
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

?>
<div id="nuz-academy-dashboard" data-nonce="<?php echo wp_create_nonce('nuz_dashboard_nonce'); ?>">
    <!-- Dashboard Header -->
    <div class="nuz-dashboard-header">
        <h1 class="nuz-dashboard-title">NUZ Online Academy - Dashboard</h1>
        <div class="nuz-dashboard-actions">
            <button class="nuz-btn nuz-btn-primary" id="refresh-dashboard">
                <span class="dashicons dashicons-update"></span>
                Refresh Data
            </button>
        </div>
    </div>

    <!-- Stats Cards Row -->
    <div class="nuz-stats-grid">
        <div class="nuz-stat-card" data-stat="students">
            <div class="nuz-stat-icon">
                <span class="dashicons dashicons-groups"></span>
            </div>
            <div class="nuz-stat-content">
                <h3 class="nuz-stat-number" data-count="0">0</h3>
                <p class="nuz-stat-label">Total Students</p>
            </div>
        </div>

        <div class="nuz-stat-card" data-stat="courses">
            <div class="nuz-stat-icon">
                <span class="dashicons dashicons-book"></span>
            </div>
            <div class="nuz-stat-content">
                <h3 class="nuz-stat-number" data-count="0">0</h3>
                <p class="nuz-stat-label">Total Courses</p>
            </div>
        </div>

        <div class="nuz-stat-card" data-stat="revenue">
            <div class="nuz-stat-icon">
                <span class="dashicons dashicons-money-alt"></span>
            </div>
            <div class="nuz-stat-content">
                <h3 class="nuz-stat-number" data-count="0">$0</h3>
                <p class="nuz-stat-label">Total Revenue</p>
            </div>
        </div>

        <div class="nuz-stat-card" data-stat="pending">
            <div class="nuz-stat-icon">
                <span class="dashicons dashicons-warning"></span>
            </div>
            <div class="nuz-stat-content">
                <h3 class="nuz-stat-number" data-count="0">$0</h3>
                <p class="nuz-stat-label">Pending Fees</p>
            </div>
        </div>
    </div>

    <!-- Charts and Recent Data Row -->
    <div class="nuz-dashboard-row">
        <!-- Monthly Enrollment Chart -->
        <div class="nuz-chart-section">
            <div class="nuz-section-header">
                <h2 class="nuz-section-title">Monthly Enrollment Trends</h2>
                <div class="nuz-chart-controls">
                    <select id="chart-period" class="nuz-select">
                        <option value="6">Last 6 Months</option>
                        <option value="12" selected>Last 12 Months</option>
                        <option value="24">Last 24 Months</option>
                    </select>
                </div>
            </div>
            <div class="nuz-chart-container">
                <canvas id="monthly-enrollment-chart" width="400" height="200"></canvas>
            </div>
            <div id="chart-loading" class="nuz-loading-overlay" style="display: none;">
                <div class="nuz-spinner"></div>
            </div>
        </div>

        <!-- Recent Admissions -->
        <div class="nuz-recent-section">
            <div class="nuz-section-header">
                <h2 class="nuz-section-title">Recent Admissions</h2>
                <a href="<?php echo admin_url('admin.php?page=nuz-students'); ?>" class="nuz-view-all">
                    View All
                </a>
            </div>
            <div class="nuz-recent-table">
                <table class="nuz-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="recent-admissions-body">
                        <tr class="nuz-loading-row">
                            <td colspan="4">
                                <div class="nuz-loading">
                                    <span class="nuz-spinner small"></span>
                                    Loading recent admissions...
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Course Status and Actions Row -->
    <div class="nuz-dashboard-row">
        <!-- Upcoming Course Starts -->
        <div class="nuz-courses-section">
            <div class="nuz-section-header">
                <h2 class="nuz-section-title">Upcoming Course Starts</h2>
                <a href="<?php echo admin_url('admin.php?page=nuz-courses'); ?>" class="nuz-view-all">
                    Manage Courses
                </a>
            </div>
            <div class="nuz-upcoming-courses">
                <div id="upcoming-courses-list">
                    <div class="nuz-loading">
                        <span class="nuz-spinner small"></span>
                        Loading upcoming courses...
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="nuz-actions-section">
            <div class="nuz-section-header">
                <h2 class="nuz-section-title">Quick Actions</h2>
            </div>
            <div class="nuz-quick-actions">
                <button class="nuz-action-btn" data-action="new-student">
                    <span class="dashicons dashicons-plus-alt"></span>
                    <span>Add New Student</span>
                </button>
                <button class="nuz-action-btn" data-action="new-course">
                    <span class="dashicons dashicons-welcome-add-page"></span>
                    <span>Create Course</span>
                </button>
                <button class="nuz-action-btn" data-action="process-payment">
                    <span class="dashicons dashicons-money"></span>
                    <span>Process Payment</span>
                </button>
                <button class="nuz-action-btn" data-action="view-reports">
                    <span class="dashicons dashicons-chart-line"></span>
                    <span>View Reports</span>
                </button>
                <button class="nuz-action-btn" data-action="export-data">
                    <span class="dashicons dashicons-download"></span>
                    <span>Export Data</span>
                </button>
                <button class="nuz-action-btn" data-action="upload-screenshots">
                    <span class="dashicons dashicons-format-gallery"></span>
                    <span>Upload Screenshots</span>
                </button>
            </div>
        </div>
    </div>

    <!-- System Status -->
    <div class="nuz-system-status">
        <h2 class="nuz-section-title">System Status</h2>
        <div class="nuz-status-grid">
            <div class="nuz-status-item">
                <span class="nuz-status-label">Database Connection:</span>
                <span class="nuz-status-value" data-status="db">Checking...</span>
            </div>
            <div class="nuz-status-item">
                <span class="nuz-status-label">Plugin Version:</span>
                <span class="nuz-status-value" data-status="version"><?php echo defined('NUZ_ACADEMY_VERSION') ? NUZ_ACADEMY_VERSION : '1.0.0'; ?></span>
            </div>
            <div class="nuz-status-item">
                <span class="nuz-status-label">WordPress Version:</span>
                <span class="nuz-status-value" data-status="wp"><?php echo get_bloginfo('version'); ?></span>
            </div>
            <div class="nuz-status-item">
                <span class="nuz-status-label">PHP Version:</span>
                <span class="nuz-status-value" data-status="php"><?php echo PHP_VERSION; ?></span>
            </div>
        </div>
    </div>
</div>

<!-- Dashboard Loading Overlay -->
<div id="dashboard-loading" class="nuz-loading-overlay" style="display: none;">
    <div class="nuz-loading-content">
        <div class="nuz-spinner large"></div>
        <p>Loading Dashboard Data...</p>
    </div>
</div>

<!-- Toast Notifications -->
<div id="nuz-toast-container" class="nuz-toast-container"></div>