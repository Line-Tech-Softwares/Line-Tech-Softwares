/**
 * Role Suggestions System for CV Builder
 * Provides intelligent suggestions based on selected role/profession
 * Features: Multiple roles, custom role support, contextual suggestions
 */

const RoleSuggestions = {
    roles: {
        'Software Engineer': {
            title: 'Software Engineer / Senior Software Engineer',
            skills: 'JavaScript, Python, Java, C++, React, Node.js, Git, SQL, REST APIs, Agile, JIRA, Docker',
            summary: 'Results-driven Software Engineer with expertise in full-stack development and clean code principles. Proven track record of delivering scalable solutions and mentoring junior developers.',
            sections: ['experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
            color: '#3b82f6'
        },
        'Product Manager': {
            title: 'Product Manager / Senior Product Manager',
            skills: 'Product Strategy, User Research, Data Analysis, SQL, A/B Testing, Roadmapping, Stakeholder Management, Market Research, Analytics',
            summary: 'Strategic Product Manager with experience in defining product vision, analyzing market trends, and leading cross-functional teams to deliver impactful solutions.',
            sections: ['experience', 'education', 'skills', 'projects', 'metrics', 'languages'],
            color: '#8b5cf6'
        },
        'Data Scientist': {
            title: 'Data Scientist / Senior Data Scientist',
            skills: 'Python, R, SQL, Machine Learning, TensorFlow, Pandas, Tableau, Statistics, Deep Learning, Data Visualization, Big Data',
            summary: 'Data-driven Data Scientist with expertise in building predictive models, analyzing complex datasets, and translating insights into actionable business strategies.',
            sections: ['experience', 'education', 'skills', 'projects', 'publications', 'certifications'],
            color: '#ec4899'
        },
        'UX/UI Designer': {
            title: 'UX/UI Designer / Lead Designer',
            skills: 'Figma, Adobe XD, Wireframing, Prototyping, User Testing, Information Architecture, CSS, HTML, Design Systems, Mobile Design, Accessibility',
            summary: 'Creative UX/UI Designer passionate about crafting user-centered digital experiences. Skilled in research-driven design and cross-functional collaboration.',
            sections: ['experience', 'education', 'skills', 'projects', 'portfolio-link', 'tools'],
            color: '#f59e0b'
        },
        'Frontend Developer': {
            title: 'Frontend Developer / Senior Frontend Developer',
            skills: 'HTML, CSS, JavaScript, React, Vue.js, TypeScript, Responsive Design, WebPack, npm, Git, Performance Optimization',
            summary: 'Frontend Developer with expertise in building responsive, user-friendly web applications using modern frameworks and best practices.',
            sections: ['experience', 'education', 'skills', 'projects', 'tools', 'languages'],
            color: '#10b981'
        },
        'Backend Developer': {
            title: 'Backend Developer / Senior Backend Developer',
            skills: 'Node.js, Python, Java, SQL, NoSQL, REST APIs, Microservices, Docker, Kubernetes, AWS, Database Design, System Design',
            summary: 'Backend Developer specializing in building scalable, robust server-side applications and APIs. Strong foundation in software architecture and system design.',
            sections: ['experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
            color: '#06b6d4'
        },
        'Marketing Manager': {
            title: 'Marketing Manager / Senior Marketing Manager',
            skills: 'Digital Marketing, SEO/SEM, Social Media, Content Marketing, Google Analytics, Email Marketing, Campaign Management, Brand Strategy, Market Research',
            summary: 'Results-oriented Marketing Manager with proven expertise in developing and executing comprehensive marketing strategies that drive brand awareness and revenue growth.',
            sections: ['experience', 'education', 'skills', 'campaigns', 'achievements', 'languages'],
            color: '#f97316'
        },
        'Sales Executive': {
            title: 'Sales Executive / Account Manager',
            skills: 'B2B Sales, CRM, Client Relations, Negotiation, Territory Management, Lead Generation, Sales Presentations, Customer Retention, Salesforce',
            summary: 'Sales-driven professional with a track record of exceeding targets through strategic account management and relationship building.',
            sections: ['experience', 'education', 'skills', 'achievements', 'languages'],
            color: '#06b6d4'
        },
        'Project Manager': {
            title: 'Project Manager / Senior Project Manager',
            skills: 'Project Planning, Risk Management, Stakeholder Communication, Agile, Scrum, JIRA, Budget Management, Team Leadership, Microsoft Project',
            summary: 'Experienced Project Manager with expertise in delivering complex projects on time and within budget while maintaining high team morale.',
            sections: ['experience', 'education', 'skills', 'certifications', 'achievements', 'languages'],
            color: '#a855f7'
        },
        'Business Analyst': {
            title: 'Business Analyst / Senior Business Analyst',
            skills: 'Requirements Analysis, SQL, Data Visualization, Business Process Modeling, Stakeholder Management, JIRA, Excel, UML Diagrams',
            summary: 'Analytical Business Analyst with expertise in gathering requirements, analyzing business processes, and delivering data-driven insights.',
            sections: ['experience', 'education', 'skills', 'projects', 'tools', 'languages'],
            color: '#06b6d4'
        },
        'HR Manager': {
            title: 'Human Resources Manager / HR Business Partner',
            skills: 'Recruitment, Employee Relations, Performance Management, Compensation & Benefits, HR Policies, ATS Systems, Talent Development, Payroll',
            summary: 'Strategic HR professional committed to building high-performing teams, fostering positive workplace culture, and driving organizational growth.',
            sections: ['experience', 'education', 'skills', 'certifications', 'achievements', 'languages'],
            color: '#ec4899'
        },
        'Finance Manager': {
            title: 'Finance Manager / Financial Analyst',
            skills: 'Financial Analysis, Budgeting, Forecasting, Excel, SQL, Accounting Software, Risk Management, Financial Reporting, SAP, Oracle',
            summary: 'Results-oriented Finance Manager with comprehensive experience in financial planning, analysis, and strategic cost management.',
            sections: ['experience', 'education', 'skills', 'certifications', 'achievements', 'languages'],
            color: '#10b981'
        },
        'DevOps Engineer': {
            title: 'DevOps Engineer / Senior DevOps Engineer',
            skills: 'Docker, Kubernetes, CI/CD, Jenkins, AWS, Azure, Linux, Ansible, Terraform, Git, Monitoring, Infrastructure as Code',
            summary: 'DevOps specialist with expertise in designing and implementing scalable, reliable infrastructure and automation solutions.',
            sections: ['experience', 'education', 'skills', 'projects', 'certifications', 'tools'],
            color: '#ef4444'
        },
        'Security Engineer': {
            title: 'Security Engineer / Cybersecurity Specialist',
            skills: 'Network Security, Penetration Testing, Compliance, SIEM, Firewalls, SSL/TLS, Python, SQL, Risk Assessment, Incident Response',
            summary: 'Security-conscious professional dedicated to protecting organizational assets through proactive threat detection and robust security implementations.',
            sections: ['experience', 'education', 'skills', 'certifications', 'projects', 'languages'],
            color: '#ef4444'
        }
    },

    /**
     * Get suggestions for a specific role
     */
    getSuggestions(role) {
        return this.roles[role] || null;
    },

    /**
     * Get all available roles
     */
    getAllRoles() {
        return Object.keys(this.roles);
    },

    /**
     * Get role by partial match
     */
    findRole(query) {
        const q = query.toLowerCase();
        return Object.keys(this.roles).find(role => role.toLowerCase().includes(q));
    },

    /**
     * Add custom role
     */
    addCustomRole(roleName, config) {
        if (!this.roles[roleName]) {
            this.roles[roleName] = {
                title: roleName,
                skills: 'Add your key skills separated by commas',
                summary: `Experienced ${roleName} with expertise in delivering results.`,
                sections: ['experience', 'education', 'skills', 'languages'],
                color: '#3b82f6',
                custom: true,
                ...config
            };
            return true;
        }
        return false;
    },

    /**
     * Get role suggestions as HTML options
     */
    getRolesAsOptions() {
        return Object.keys(this.roles).map(role => `<option value="${role}">${role}</option>`).join('');
    }
};

/**
 * Initialize role selector with suggestions
 */
function initializeRoleSelector(selectElementId, onSelectCallback = null) {
    const select = document.getElementById(selectElementId);
    if (!select) return;

    // Populate options
    const options = RoleSuggestions.getRolesAsOptions();
    select.innerHTML = `<option value="">Select Your Role</option>${options}<option value="___custom">+ Add Custom Role</option>`;

    // Handle selection
    select.addEventListener('change', (e) => {
        const role = e.target.value;
        
        if (role === '___custom') {
            const customRole = prompt('Enter your role/profession:\n(e.g., "Lead Technical Architect", "Solutions Engineer")');
            if (customRole) {
                RoleSuggestions.addCustomRole(customRole);
                select.innerHTML = `<option value="">Select Your Role</option>${RoleSuggestions.getRolesAsOptions()}<option value="___custom">+ Add Custom Role</option>`;
                select.value = customRole;
                applyRoleSuggestions(customRole, onSelectCallback);
            } else {
                select.value = '';
            }
        } else if (role) {
            applyRoleSuggestions(role, onSelectCallback);
        }
    });
}

/**
 * Apply role suggestions to form fields
 */
function applyRoleSuggestions(role, callback = null) {
    const suggestions = RoleSuggestions.getSuggestions(role);
    if (!suggestions) return;

    // Update fields
    if (document.getElementById('title')) {
        document.getElementById('title').placeholder = suggestions.title;
    }
    
    if (document.getElementById('skills')) {
        document.getElementById('skills').placeholder = suggestions.skills;
    }
    
    if (document.getElementById('summary')) {
        document.getElementById('summary').placeholder = suggestions.summary;
    }

    // Show suggestion cards
    showRoleSuggestions(suggestions);

    // Trigger custom callback if provided
    if (callback) callback(suggestions);
}

/**
 * Display role suggestions in the UI
 */
function showRoleSuggestions(suggestions) {
    const container = document.getElementById('role-suggestions-container');
    if (!container) return;

    container.innerHTML = `
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid ${suggestions.color}; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                <div style="width: 4px; height: 32px; background: ${suggestions.color}; border-radius: 4px;"></div>
                <div>
                    <h3 style="margin: 0; color: ${suggestions.color}; font-size: 16px; font-weight: 600;">
                        <i class="fas fa-lightbulb"></i> Role Suggestions
                    </h3>
                    <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 13px;">AI-powered recommendations for your role</p>
                </div>
            </div>
            
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 13px; font-weight: 600; text-transform: uppercase;">Suggested Title</p>
                <p style="margin: 0; color: #e5e7eb; font-size: 14px;">${suggestions.title}</p>
            </div>
            
            <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">
                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 13px; font-weight: 600; text-transform: uppercase;">Suggested Summary</p>
                <p style="margin: 0; color: #e5e7eb; font-size: 14px;">${suggestions.summary}</p>
            </div>
            
            <div>
                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 13px; font-weight: 600; text-transform: uppercase;">Key Skills</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${suggestions.skills.split(',').map(skill => `
                        <span style="background: ${suggestions.color}22; border: 1px solid ${suggestions.color}; color: ${suggestions.color}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            ${skill.trim()}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Clear role suggestions
 */
function clearRoleSuggestions() {
    const container = document.getElementById('role-suggestions-container');
    if (container) container.innerHTML = '';
}
