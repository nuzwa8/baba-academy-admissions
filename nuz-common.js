/**
 * NUZ Online Academy - Common JavaScript
 * 
 * Shared utilities and functions used across all pages
 * @package NuzOnlineAcademy
 * @version 1.0.0
 */

// Common utilities namespace
const NUZCommon = {
    
    // AJAX helper with enhanced error handling
    ajax: function(options) {
        const defaults = {
            type: 'POST',
            dataType: 'json',
            timeout: 30000,
            beforeSend: function() {
                NUZCommon.showLoading();
            },
            complete: function() {
                NUZCommon.hideLoading();
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', { xhr, status, error });
                NUZCommon.showNotification('Network error occurred', 'error');
            }
        };
        
        const settings = jQuery.extend(true, defaults, options);
        return jQuery.ajax(settings);
    },
    
    // Form validation
    validateForm: function(form) {
        const errors = [];
        const requiredFields = form.find('[required]');
        
        requiredFields.each(function() {
            const field = jQuery(this);
            const value = field.val().trim();
            
            if (!value) {
                errors.push(`${field.attr('name')} is required`);
                field.addClass('is-invalid');
            } else {
                field.removeClass('is-invalid');
            }
            
            // Email validation
            if (field.attr('type') === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push('Invalid email address');
                    field.addClass('is-invalid');
                }
            }
            
            // Phone validation
            if (field.attr('name') === 'phone' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    errors.push('Invalid phone number');
                    field.addClass('is-invalid');
                }
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // File upload utilities
    uploadFile: function(file, options = {}) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('action', options.action || 'nuz_upload_file');
            formData.append('nonce', nuz_ajax.nonce);
            
            // Add additional data
            if (options.data) {
                Object.keys(options.data).forEach(key => {
                    formData.append(key, options.data[key]);
                });
            }
            
            jQuery.ajax({
                url: nuz_ajax.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                xhr: function() {
                    const xhr = new window.XMLHttpRequest();
                    
                    if (options.progress) {
                        xhr.upload.addEventListener('progress', function(e) {
                            if (e.lengthComputable) {
                                const percentComplete = (e.loaded / e.total) * 100;
                                options.progress(percentComplete);
                            }
                        });
                    }
                    
                    return xhr;
                },
                success: function(response) {
                    if (response.success) {
                        resolve(response.data);
                    } else {
                        reject(response.data || 'Upload failed');
                    }
                },
                error: function() {
                    reject('Upload error');
                }
            });
        });
    },
    
    // Date utilities
    formatDate: function(date, format = 'YYYY-MM-DD') {
        if (!date) return '';
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    parseDate: function(dateString, format = 'YYYY-MM-DD') {
        if (!dateString) return null;
        
        const parts = dateString.split(/[\/\-\.]/);
        const formatParts = format.split(/[\/\-\.]/);
        
        const date = {};
        parts.forEach((part, index) => {
            date[formatParts[index]] = parseInt(part, 10);
        });
        
        return new Date(date.YYYY, (date.MM - 1), date.DD);
    },
    
    // Currency utilities
    formatCurrency: function(amount, currency = 'USD', symbol = '$') {
        if (isNaN(amount)) return symbol + '0.00';
        
        const number = parseFloat(amount);
        return symbol + number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },
    
    // String utilities
    slugify: function(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s\-]/g, '')
            .replace(/[\s\-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    truncate: function(text, length = 50, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },
    
    capitalize: function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    titleCase: function(text) {
        return text.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    
    // Array utilities
    unique: function(array) {
        return [...new Set(array)];
    },
    
    groupBy: function(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    },
    
    sortBy: function(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
            } else {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
        });
    },
    
    // Local storage utilities
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(`nuz_${key}`, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(`nuz_${key}`);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(`nuz_${key}`);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('nuz_')) {
                        localStorage.removeItem(key);
                    }
                });
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    },
    
    // URL utilities
    getUrlParams: function() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },
    
    setUrlParams: function(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    },
    
    // Loading states
    showLoading: function(target) {
        if (target) {
            target.prop('disabled', true).addClass('loading');
        } else {
            if (jQuery('#nuz-global-loading').length === 0) {
                jQuery('body').append(`
                    <div id="nuz-global-loading" class="nuz-loading">
                        <div class="nuz-spinner"></div>
                        <div class="nuz-loading-text">Loading...</div>
                    </div>
                `);
            }
            jQuery('#nuz-global-loading').show();
        }
    },
    
    hideLoading: function(target) {
        if (target) {
            target.prop('disabled', false).removeClass('loading');
        } else {
            jQuery('#nuz-global-loading').hide();
        }
    },
    
    // Notification system
    showNotification: function(message, type = 'info', duration = 5000) {
        const id = 'nuz-notification-' + Date.now();
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const notification = jQuery(`
            <div id="${id}" class="nuz-notification nuz-notification-${type}">
                <div class="nuz-notification-icon">
                    <i class="${iconMap[type] || iconMap.info}"></i>
                </div>
                <div class="nuz-notification-content">
                    <div class="nuz-notification-message">${message}</div>
                </div>
                <button class="nuz-notification-close">&times;</button>
            </div>
        `);
        
        // Add to container
        if (jQuery('#nuz-notifications').length === 0) {
            jQuery('body').append('<div id="nuz-notifications" class="nuz-notifications"></div>');
        }
        
        jQuery('#nuz-notifications').append(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.addClass('show');
        }, 100);
        
        // Auto-hide
        setTimeout(() => {
            NUZCommon.hideNotification(id);
        }, duration);
        
        // Close button
        notification.find('.nuz-notification-close').click(() => {
            NUZCommon.hideNotification(id);
        });
        
        return id;
    },
    
    hideNotification: function(id) {
        const notification = jQuery(`#${id}`);
        if (notification.length) {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    },
    
    // Modal utilities
    showModal: function(content, options = {}) {
        const id = options.id || 'nuz-modal-' + Date.now();
        const modal = jQuery(`
            <div id="${id}" class="nuz-modal">
                <div class="nuz-modal-content">
                    <div class="nuz-modal-header">
                        <h3 class="nuz-modal-title">${options.title || ''}</h3>
                        <button class="nuz-modal-close">&times;</button>
                    </div>
                    <div class="nuz-modal-body">${content}</div>
                    <div class="nuz-modal-footer">
                        <button type="button" class="nuz-btn nuz-btn-secondary nuz-modal-cancel">Cancel</button>
                        <button type="button" class="nuz-btn nuz-btn-primary nuz-modal-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `);
        
        jQuery('body').append(modal);
        
        // Show modal
        setTimeout(() => {
            modal.addClass('show');
        }, 100);
        
        // Close handlers
        modal.find('.nuz-modal-close, .nuz-modal-cancel').click(() => {
            NUZCommon.hideModal(id);
        });
        
        modal.click(function(e) {
            if (e.target === this) {
                NUZCommon.hideModal(id);
            }
        });
        
        // Confirm handler
        modal.find('.nuz-modal-confirm').click(function() {
            if (options.onConfirm) {
                options.onConfirm();
            }
            NUZCommon.hideModal(id);
        });
        
        // Escape key handler
        jQuery(document).on('keydown.nuz-modal', function(e) {
            if (e.key === 'Escape') {
                NUZCommon.hideModal(id);
                jQuery(document).off('keydown.nuz-modal');
            }
        });
        
        return id;
    },
    
    hideModal: function(id) {
        const modal = jQuery(`#${id}`);
        if (modal.length) {
            modal.removeClass('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },
    
    // Table utilities
    sortTable: function(table, column, direction = 'asc') {
        const tbody = table.find('tbody');
        const rows = tbody.find('tr').toArray();
        
        rows.sort(function(a, b) {
            const aVal = jQuery(a).find('td').eq(column).text().trim();
            const bVal = jQuery(b).find('td').eq(column).text().trim();
            
            // Try to parse as numbers
            const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return direction === 'asc' ? aNum - bNum : bNum - aNum;
            } else {
                return direction === 'asc' 
                    ? aVal.localeCompare(bVal) 
                    : bVal.localeCompare(aVal);
            }
        });
        
        tbody.empty().append(rows);
        
        // Update sort indicators
        table.find('.nuz-sort-indicator').remove();
        const header = table.find('th').eq(column);
        const indicator = jQuery(`<span class="nuz-sort-indicator">${direction === 'asc' ? ' ▲' : ' ▼'}</span>`);
        header.append(indicator);
    },
    
    // Search/filter utilities
    filterTable: function(table, searchTerm) {
        const rows = table.find('tbody tr');
        const term = searchTerm.toLowerCase();
        
        rows.each(function() {
            const row = jQuery(this);
            const text = row.text().toLowerCase();
            
            if (text.indexOf(term) !== -1) {
                row.show();
            } else {
                row.hide();
            }
        });
    },
    
    // Export utilities
    downloadCSV: function(data, filename, headers = true) {
        let csv = '';
        
        if (headers && data.length > 0) {
            const headerRow = Object.keys(data[0]).map(key => `"${key}"`).join(',');
            csv += headerRow + '\n';
        }
        
        data.forEach(row => {
            const values = Object.values(row).map(value => `"${value}"`).join(',');
            csv += values + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
    
    downloadJSON: function(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
    
    // Device detection
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet: function() {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    },
    
    // Browser detection
    getBrowserInfo: function() {
        const ua = navigator.userAgent;
        const browsers = [
            { name: 'Chrome', test: /Chrome\/(\d+)/ },
            { name: 'Firefox', test: /Firefox\/(\d+)/ },
            { name: 'Safari', test: /Version\/(\d+).*Safari/ },
            { name: 'Edge', test: /Edge\/(\d+)/ },
            { name: 'Opera', test: /Opera\/(\d+)/ }
        ];
        
        for (const browser of browsers) {
            const match = ua.match(browser.test);
            if (match) {
                return {
                    name: browser.name,
                    version: match[1]
                };
            }
        }
        
        return { name: 'Unknown', version: '0' };
    },
    
    // Performance utilities
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Animation utilities
    fadeIn: function(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(timestamp) {
            const progress = (timestamp - start) / duration;
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    fadeOut: function(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            const progress = (timestamp - start) / duration;
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // Color utilities
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Random utilities
    random: function(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt: function(min = 0, max = 10) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomString: function(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Initialize common utilities when DOM is ready
jQuery(document).ready(function() {
    // Add utility functions to jQuery
    jQuery.fn.nuzValidateForm = function() {
        return NUZCommon.validateForm(jQuery(this));
    };
    
    jQuery.fn.nuzSortTable = function(column, direction) {
        NUZCommon.sortTable(jQuery(this), column, direction);
    };
    
    jQuery.fn.nuzFilterTable = function(searchTerm) {
        NUZCommon.filterTable(jQuery(this), searchTerm);
    };
    
    // Global error handler
    jQuery(window).on('error', function(event) {
        console.error('Global error:', event.originalEvent.message);
    });
    
    // Unhandled promise rejection handler
    jQuery(window).on('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
    });
});

// Export for use in other scripts
window.NUZCommon = NUZCommon;