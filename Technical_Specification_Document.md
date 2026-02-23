<h1>MedConnect Pro — Comprehensive Technical Specification</h1><h2>Professional Networking &amp; Learning Platform for Healthcare Professionals</h2><p><strong>Document Version:</strong> 2.0 <strong>Status:</strong> Draft for Review <strong>Classification:</strong> Confidential</p><hr><h1>TABLE OF CONTENTS</h1><ol> <li><a href="#1-executive-summary--vision">Executive Summary &amp; Vision</a></li> <li><a href="#2-consolidated-requirements">Consolidated Requirements from Prior Analysis</a></li> <li><a href="#3-system-architecture--technology-stack">System Architecture &amp; Technology Stack</a></li> <li><a href="#4-database-schema">Database Schema — Complete Design</a></li> <li><a href="#5-professional-networking">Feature Specification: Professional Networking</a></li> <li><a href="#6-learning-management-system">Feature Specification: Learning Management System</a></li> <li><a href="#7-certification-tracking--course-finder">Feature Specification: Certification Tracking &amp; Course Finder</a></li> <li><a href="#8-medical-reference-library">Feature Specification: Verified Medical Reference Library</a></li> <li><a href="#9-subscription--pricing-model">Subscription &amp; Pricing Model</a></li> <li><a href="#10-integration-points">Integration Points: Networking ↔ Learning</a></li> <li><a href="#11-security--compliance">Security, HIPAA Compliance &amp; Infrastructure</a></li> <li><a href="#12-implementation-roadmap">Implementation Roadmap</a></li> <li><a href="#13-appendices">Appendices</a></li> </ol><hr><h1>1. EXECUTIVE SUMMARY &amp; VISION</h1><h2>1.1 Product Overview</h2><p><strong>MedConnect Pro</strong> is a comprehensive professional networking and learning platform purpose-built for nurses, nurse practitioners (NPs), physician assistants (PAs), and allied health professionals. It unifies six critical capabilities that currently require 5–8 separate applications into a single, seamless experience:</p><ol> <li><strong>LinkedIn-style Professional Networking</strong> — Profiles, connections, messaging, activity feeds</li> <li><strong>Integrated Learning Management System (LMS)</strong> — Courses, progress tracking, CE credits, certifications</li> <li><strong>Certification &amp; License Tracking</strong> — BLS, ACLS, PALS expiration alerts with smart reminders</li> <li><strong>Location-Based Recertification Course Finder</strong> — Find and register for nearby hands-on classes</li> <li><strong>Verified Medical Reference Library</strong> — Evidence-based content with peer-reviewed citations</li> <li><strong>Peer Collaboration Tools</strong> — Study groups, Q&amp;A forums, mentorship matching</li> </ol><h2>1.2 Market Context (from Prior Research)</h2><p>Our prior market research analyzed 17+ existing platforms and confirmed:</p><ul> <li><strong>No single platform combines all six features.</strong> The market is fragmented.</li> <li><strong>Doximity</strong> (2M+ users) dominates physician networking but excludes RNs/LPNs and lacks certification tracking, CE, and course finding.</li> <li><strong>CerTracker</strong> excels at certification tracking but has zero networking or education features.</li> <li><strong>Nurse.com</strong> leads in nursing CE but lacks certification tracking, location-based course finding, and clinical reference.</li> <li><strong>CE Broker</strong> is the gold standard for CE compliance tracking but offers no networking or clinical content.</li> <li><strong>UpToDate</strong> provides the best evidence-based content with citations but costs $500+/year and is physician-focused.</li> <li><strong>Location-based recertification course finding</strong> is a completely unaddressed need in the current market.</li> </ul><p><strong>Total Addressable Market:</strong> 7.5M+ healthcare professionals in the U.S. alone (4.7M RNs, 355K NPs, 1M+ LPNs, 1.5M+ CNAs).</p><h2>1.3 Target Users</h2><table class="e-rte-table"> <thead> <tr> <th>Tier</th> <th>User Type</th> <th>Estimated U.S. Population</th> </tr> </thead> <tbody><tr> <td>Primary</td> <td>Registered Nurses (RNs), Nurse Practitioners (NPs), Licensed Practical Nurses (LPNs/LVNs)</td> <td>~6.0M</td> </tr> <tr> <td>Secondary</td> <td>Physician Assistants (PAs), Certified Nursing Assistants (CNAs), Respiratory Therapists</td> <td>~2.0M</td> </tr> <tr> <td>Tertiary</td> <td>Nursing students, healthcare educators, healthcare employers/recruiters</td> <td>~1.5M</td> </tr> </tbody></table><hr><h1>2. CONSOLIDATED REQUIREMENTS FROM PRIOR ANALYSIS</h1><p>The following is a complete consolidation of all requirements identified in our previous market research and requirements document, now expanded with the LinkedIn-style networking and LMS specifications.</p><h2>2.1 Requirements Traceability Matrix</h2><table class="e-rte-table"> <thead> <tr> <th>Req Category</th> <th>Source</th> <th>Total Requirements</th> <th>P0 (Must Have)</th> <th>P1 (Should Have)</th> <th>P2 (Nice to Have)</th> </tr> </thead> <tbody><tr> <td>Professional Networking</td> <td>Prior Doc + New Request</td> <td>25</td> <td>14</td> <td>8</td> <td>3</td> </tr> <tr> <td>Learning Management System</td> <td>New Request</td> <td>38</td> <td>20</td> <td>12</td> <td>6</td> </tr> <tr> <td>Certification Tracking</td> <td>Prior Doc</td> <td>16</td> <td>10</td> <td>4</td> <td>2</td> </tr> <tr> <td>Location-Based Course Finder</td> <td>Prior Doc</td> <td>15</td> <td>8</td> <td>5</td> <td>2</td> </tr> <tr> <td>Medical Reference Library</td> <td>Prior Doc</td> <td>20</td> <td>12</td> <td>6</td> <td>2</td> </tr> <tr> <td>Citation System</td> <td>Prior Doc</td> <td>10</td> <td>6</td> <td>3</td> <td>1</td> </tr> <tr> <td>Peer Collaboration</td> <td>Prior Doc</td> <td>16</td> <td>8</td> <td>6</td> <td>2</td> </tr> <tr> <td>Subscription &amp; Pricing</td> <td>New Request</td> <td>14</td> <td>8</td> <td>4</td> <td>2</td> </tr> <tr> <td>Security &amp; Compliance</td> <td>Prior Doc</td> <td>20</td> <td>14</td> <td>4</td> <td>2</td> </tr> <tr> <td><strong>TOTAL</strong></td> <td><br></td> <td><strong>174</strong></td> <td><strong>100</strong></td> <td><strong>52</strong></td> <td><strong>22</strong></td> </tr> </tbody></table><hr><h1>3. SYSTEM ARCHITECTURE &amp; TECHNOLOGY STACK</h1><h2>3.1 Architecture Philosophy</h2><p>The platform follows a <strong>modular microservices architecture</strong> deployed on cloud infrastructure, designed for:</p><ul> <li><strong>Scalability:</strong> Independently scalable services to handle growth from 1K to 1M+ users</li> <li><strong>Resilience:</strong> Service isolation ensures one component failure doesn't cascade</li> <li><strong>Development velocity:</strong> Teams can work on services independently</li> <li><strong>Compliance:</strong> HIPAA-compliant infrastructure with encryption at every layer</li> <li><strong>Extensibility:</strong> Plugin architecture for future integrations and features</li> </ul><h2>3.2 High-Level System Architecture</h2><pre><code>┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                      │
│                                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────────────────────────┐   │
│  │  iOS App     │   │ Android App │   │  Web Application (SPA)           │   │
│  │  React Native│   │ React Native│   │  Next.js 14+ / React 18+        │   │
│  │  + Native    │   │ + Native    │   │  TypeScript / Tailwind CSS       │   │
│  │  Modules     │   │ Modules     │   │  Server-Side Rendering (SSR)     │   │
│  └──────┬──────┘   └──────┬──────┘   └───────────────┬──────────────────┘   │
│         │                  │                           │                      │
└─────────┼──────────────────┼───────────────────────────┼──────────────────────┘
          │                  │                           │
          └──────────────────┼───────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   CDN (CloudFront│
                    │   / Cloudflare)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer   │
                    │  (AWS ALB /      │
                    │   Nginx)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway     │
                    │  (Kong / AWS     │
                    │   API Gateway)   │
                    │                  │
                    │  • Rate Limiting │
                    │  • Auth (JWT)    │
                    │  • Request       │
                    │    Routing       │
                    │  • API Versioning│
                    │  • Request/      │
                    │    Response      │
                    │    Logging       │
                    └────────┬────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                                       │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ AUTH &amp;        │  │ PROFILE &amp;    │  │ NETWORKING   │  │ FEED &amp;       │    │
│  │ IDENTITY      │  │ CREDENTIAL   │  │ SERVICE      │  │ CONTENT      │    │
│  │ SERVICE       │  │ SERVICE      │  │              │  │ SERVICE      │    │
│  │               │  │              │  │ • Connections│  │              │    │
│  │ • Registration│  │ • Profile    │  │ • Follows    │  │ • News Feed  │    │
│  │ • Login/MFA   │  │   CRUD       │  │ • Suggestions│  │ • Posts      │    │
│  │ • JWT Tokens  │  │ • Credentials│  │ • Blocking   │  │ • Comments   │    │
│  │ • OAuth/SSO   │  │ • Verification│ │ • Search     │  │ • Likes      │    │
│  │ • RBAC        │  │ • Badges     │  │              │  │ • Shares     │    │
│  │ • Sessions    │  │ • Resume/CV  │  │              │  │ • Algorithms │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ LMS          │  │ CERTIFICATION│  │ COURSE       │  │ MEDICAL      │    │
│  │ SERVICE      │  │ TRACKING     │  │ FINDER       │  │ REFERENCE    │    │
│  │              │  │ SERVICE      │  │ SERVICE      │  │ SERVICE      │    │
│  │ • Courses    │  │              │  │              │  │              │    │
│  │ • Modules    │  │ • Cert CRUD  │  │ • Geo Search │  │ • Articles   │    │
│  │ • Lessons    │  │ • License    │  │ • Provider   │  │ • Citations  │    │
│  │ • Quizzes    │  │   Tracking   │  │   Aggregation│  │ • Drug DB    │    │
│  │ • Progress   │  │ • Expiration │  │ • Map API    │  │ • Calculators│    │
│  │ • SCORM/xAPI │  │   Alerts     │  │ • Scheduling │  │ • Search     │    │
│  │ • Certificates│ │ • OCR Import │  │ • Reviews    │  │ • Versioning │    │
│  │ • CE Credits │  │ • Verification│ │              │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ MESSAGING    │  │ COLLABORATION│  │ SUBSCRIPTION │  │ NOTIFICATION │    │
│  │ SERVICE      │  │ SERVICE      │  │ &amp; BILLING    │  │ SERVICE      │    │
│  │              │  │              │  │ SERVICE      │  │              │    │
│  │ • Direct Msgs│  │ • Forums/Q&amp;A │  │              │  │ • Email      │    │
│  │ • Group Msgs │  │ • Study Groups│ │ • Plans      │  │ • Push       │    │
│  │ • Read       │  │ • Mentorship │  │ • Stripe     │  │ • SMS        │    │
│  │   Receipts   │  │ • Upvoting   │  │   Integration│  │ • In-App     │    │
│  │ • File Share │  │ • Moderation │  │ • Invoicing  │  │ • Scheduling │    │
│  │ • WebSocket  │  │ • PHI Detect │  │ • Trials     │  │ • Preferences│    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │                  │            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ SEARCH       │  │ ANALYTICS    │  │ ADMIN        │                       │
│  │ SERVICE      │  │ SERVICE      │  │ SERVICE      │                       │
│  │              │  │              │  │              │                       │
│  │ • Elastic    │  │ • User       │  │ • User Mgmt  │                       │
│  │   search     │  │   Analytics  │  │ • Content    │                       │
│  │ • Profiles   │  │ • Learning   │  │   Moderation │                       │
│  │ • Courses    │  │   Analytics  │  │ • Reports    │                       │
│  │ • Articles   │  │ • Platform   │  │ • Config     │                       │
│  │ • Forums     │  │   Metrics    │  │ • Audit Logs │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
│                                                                              │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  MESSAGE BUS         │
                    │  (RabbitMQ /         │
                    │   AWS SQS + SNS)     │
                    │                      │
                    │  Event-Driven        │
                    │  Communication       │
                    └──────────┬──────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────────────┐
│                         DATA LAYER                                           │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ PostgreSQL 16│  │ MongoDB 7    │  │ Redis 7      │  │ Elasticsearch│    │
│  │ (Primary DB) │  │ (Content DB) │  │ (Cache +     │  │ 8 (Search)   │    │
│  │              │  │              │  │  Sessions)   │  │              │    │
│  │ • Users      │  │ • Articles   │  │ • Session    │  │ • Profile    │    │
│  │ • Profiles   │  │ • Course     │  │   Store      │  │   Index      │    │
│  │ • Connections│  │   Content    │  │ • Feed Cache │  │ • Course     │    │
│  │ • Certs      │  │ • Forum      │  │ • API Cache  │  │   Index      │    │
│  │ • Licenses   │  │   Posts      │  │ • Rate       │  │ • Article    │    │
│  │ • Subscript. │  │ • Messages   │  │   Limiting   │  │   Index      │    │
│  │ • Courses    │  │ • Activity   │  │ • Leaderboard│  │ • Forum      │    │
│  │   (metadata) │  │   Logs       │  │ • Real-time  │  │   Index      │    │
│  │ • Payments   │  │ • Citations  │  │   Presence   │  │ • Full-Text  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ AWS S3       │  │ ClickHouse   │  │ Neo4j        │                       │
│  │ (Object      │  │ (Analytics   │  │ (Graph DB -  │                       │
│  │  Storage)    │  │  Warehouse)  │  │  Optional)   │                       │
│  │              │  │              │  │              │                       │
│  │ • Documents  │  │ • Event Data │  │ • Connection │                       │
│  │ • Cert Scans │  │ • Learning   │  │   Graph      │                       │
│  │ • Course     │  │   Analytics  │  │ • Recommend- │                       │
│  │   Media      │  │ • User       │  │   ations     │                       │
│  │ • Profile    │  │   Behavior   │  │ • "People    │                       │
│  │   Photos     │  │              │  │   You May    │                       │
│  │ • Exports    │  │              │  │   Know"      │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
</code></pre><h2>3.3 Technology Stack — Detailed Recommendations</h2><h3>3.3.1 Frontend</h3><table class="e-rte-table"> <thead> <tr> <th>Layer</th> <th>Technology</th> <th>Rationale</th> </tr> </thead> <tbody><tr> <td><strong>Web Framework</strong></td> <td>Next.js 14+ (App Router)</td> <td>SSR for SEO, React Server Components for performance, built-in API routes</td> </tr> <tr> <td><strong>UI Library</strong></td> <td>React 18+ with TypeScript</td> <td>Type safety, component reusability, massive ecosystem</td> </tr> <tr> <td><strong>Styling</strong></td> <td>Tailwind CSS + shadcn/ui</td> <td>Rapid development, consistent design system, accessible components</td> </tr> <tr> <td><strong>State Management</strong></td> <td>Zustand + TanStack Query (React Query)</td> <td>Lightweight global state + powerful server state management with caching</td> </tr> <tr> <td><strong>Real-time</strong></td> <td>Socket.io client</td> <td>WebSocket connections for messaging, notifications, presence</td> </tr> <tr> <td><strong>Mobile</strong></td> <td>React Native + Expo</td> <td>Code sharing with web, native performance, OTA updates</td> </tr> <tr> <td><strong>Forms</strong></td> <td>React Hook Form + Zod</td> <td>Performant forms with schema-based validation</td> </tr> <tr> <td><strong>Rich Text Editor</strong></td> <td>Tiptap (ProseMirror)</td> <td>Extensible editor for forum posts, articles, course content</td> </tr> <tr> <td><strong>Charts/Analytics</strong></td> <td>Recharts + D3.js</td> <td>Learning analytics dashboards, progress visualizations</td> </tr> <tr> <td><strong>Video Player</strong></td> <td>Video.js / Mux Player</td> <td>Adaptive streaming for course videos, DRM support</td> </tr> </tbody></table><h3>3.3.2 Backend</h3><table class="e-rte-table"> <thead> <tr> <th>Layer</th> <th>Technology</th> <th>Rationale</th> </tr> </thead> <tbody><tr> <td><strong>Primary Language</strong></td> <td>Node.js 20+ (TypeScript)</td> <td>Full-stack TypeScript, async I/O for real-time features, large ecosystem</td> </tr> <tr> <td><strong>API Framework</strong></td> <td>NestJS</td> <td>Enterprise-grade, modular architecture, built-in dependency injection, OpenAPI support</td> </tr> <tr> <td><strong>Secondary Language</strong></td> <td>Python 3.12+ (FastAPI)</td> <td>ML/AI services (recommendations, OCR, PHI detection), data processing</td> </tr> <tr> <td><strong>API Protocol</strong></td> <td>REST (primary) + GraphQL (feed/profile queries)</td> <td>REST for CRUD operations, GraphQL for complex nested data (feeds, profiles)</td> </tr> <tr> <td><strong>Real-time</strong></td> <td>Socket.io (Node.js)</td> <td>WebSocket server for messaging, notifications, live collaboration</td> </tr> <tr> <td><strong>Task Queue</strong></td> <td>BullMQ (Redis-backed)</td> <td>Background jobs: email sending, OCR processing, notification scheduling, analytics</td> </tr> <tr> <td><strong>API Documentation</strong></td> <td>OpenAPI 3.1 (Swagger)</td> <td>Auto-generated docs, client SDK generation, contract testing</td> </tr> </tbody></table><h3>3.3.3 Data Layer</h3><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Technology</th> <th>Use Case</th> </tr> </thead> <tbody><tr> <td><strong>Primary Database</strong></td> <td>PostgreSQL 16</td> <td>Structured data: users, profiles, certifications, licenses, subscriptions, course metadata, payments</td> </tr> <tr> <td><strong>Document Database</strong></td> <td>MongoDB 7</td> <td>Semi-structured data: articles, course content, forum posts, messages, activity logs, citations</td> </tr> <tr> <td><strong>Cache</strong></td> <td>Redis 7 (Cluster)</td> <td>Session management, API response caching, feed caching, rate limiting, real-time presence, leaderboards</td> </tr> <tr> <td><strong>Search Engine</strong></td> <td>Elasticsearch 8</td> <td>Full-text search across profiles, courses, articles, forums; faceted search; autocomplete</td> </tr> <tr> <td><strong>Object Storage</strong></td> <td>AWS S3 (or compatible)</td> <td>Documents, certificates, course media (video, PDF), profile photos, exports</td> </tr> <tr> <td><strong>Analytics DB</strong></td> <td>ClickHouse</td> <td>Event-level analytics, learning analytics, platform metrics, reporting</td> </tr> <tr> <td><strong>Graph Database</strong></td> <td>Neo4j (Phase 3+)</td> <td>Connection graph for "People You May Know," course recommendations, mentorship matching</td> </tr> <tr> <td><strong>Message Queue</strong></td> <td>RabbitMQ (or AWS SQS/SNS)</td> <td>Async inter-service communication, event-driven architecture</td> </tr> </tbody></table><h3>3.3.4 Infrastructure &amp; DevOps</h3><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Technology</th> <th>Rationale</th> </tr> </thead> <tbody><tr> <td><strong>Cloud Provider</strong></td> <td>AWS (primary)</td> <td>HIPAA-eligible services, BAA available, broadest service catalog</td> </tr> <tr> <td><strong>Container Orchestration</strong></td> <td>AWS ECS Fargate (or EKS)</td> <td>Serverless containers, auto-scaling, no server management</td> </tr> <tr> <td><strong>CI/CD</strong></td> <td>GitHub Actions + ArgoCD</td> <td>Automated testing, building, deployment; GitOps workflow</td> </tr> <tr> <td><strong>Infrastructure as Code</strong></td> <td>Terraform + AWS CDK</td> <td>Reproducible infrastructure, version-controlled, multi-environment</td> </tr> <tr> <td><strong>Monitoring</strong></td> <td>Datadog (or Grafana + Prometheus)</td> <td>APM, log aggregation, custom dashboards, alerting</td> </tr> <tr> <td><strong>Error Tracking</strong></td> <td>Sentry</td> <td>Real-time error tracking, release tracking, performance monitoring</td> </tr> <tr> <td><strong>CDN</strong></td> <td>CloudFront + S3</td> <td>Static asset delivery, video streaming, global edge caching</td> </tr> <tr> <td><strong>DNS</strong></td> <td>Route 53</td> <td>DNS management, health checks, failover routing</td> </tr> <tr> <td><strong>Secrets Management</strong></td> <td>AWS Secrets Manager + HashiCorp Vault</td> <td>Secure credential storage, rotation, audit logging</td> </tr> <tr> <td><strong>WAF</strong></td> <td>AWS WAF</td> <td>Web application firewall, DDoS protection, bot management</td> </tr> </tbody></table><h3>3.3.5 Third-Party Services</h3><table class="e-rte-table"> <thead> <tr> <th>Service</th> <th>Provider</th> <th>Purpose</th> </tr> </thead> <tbody><tr> <td><strong>Payments</strong></td> <td>Stripe</td> <td>Subscription billing, one-time payments, invoicing, tax calculation</td> </tr> <tr> <td><strong>Email</strong></td> <td>AWS SES + SendGrid (transactional)</td> <td>Notification emails, marketing emails, deliverability</td> </tr> <tr> <td><strong>SMS</strong></td> <td>Twilio</td> <td>Certification expiration SMS alerts, MFA codes</td> </tr> <tr> <td><strong>Push Notifications</strong></td> <td>Firebase Cloud Messaging (FCM) + APNs</td> <td>Mobile push notifications</td> </tr> <tr> <td><strong>Video Hosting</strong></td> <td>Mux (or AWS MediaConvert + CloudFront)</td> <td>Adaptive bitrate streaming, DRM, analytics</td> </tr> <tr> <td><strong>OCR</strong></td> <td>AWS Textract</td> <td>Certificate/license document scanning and data extraction</td> </tr> <tr> <td><strong>Maps</strong></td> <td>Mapbox (or Google Maps)</td> <td>Course finder map, geocoding, distance calculations</td> </tr> <tr> <td><strong>Identity Verification</strong></td> <td>NURSYS API + manual review</td> <td>Nursing license verification</td> </tr> <tr> <td><strong>Citation API</strong></td> <td>PubMed E-utilities + CrossRef</td> <td>Citation metadata, DOI resolution, link verification</td> </tr> </tbody></table><hr><h1>4. DATABASE SCHEMA — COMPLETE DESIGN</h1><h2>4.1 PostgreSQL Schema (Relational Data)</h2><h3>4.1.1 User &amp; Authentication</h3><pre><code class="language-sql">-- ============================================================
-- USERS &amp; AUTHENTICATION
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'free_user', 'premium_user', 'pro_user', 'enterprise_user',
    'content_author', 'instructor', 'moderator', 'admin', 'super_admin'
);

CREATE TYPE verification_level AS ENUM (
    'none', 'email_verified', 'license_pending', 'license_verified', 'fully_verified'
);

CREATE TYPE account_status AS ENUM (
    'active', 'suspended', 'deactivated', 'pending_verification', 'banned'
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    -- Basic Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    headline VARCHAR(300),  -- e.g., "ICU Nurse | CCRN | BSN"
    bio TEXT,
    profile_photo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    -- Professional Info
    primary_role VARCHAR(50),  -- RN, LPN, NP, PA, CNA, Student, etc.
    primary_specialty VARCHAR(255),
    years_of_experience INTEGER,
    -- Location
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(10),
    location_country VARCHAR(50) DEFAULT 'US',
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    -- Platform
    role user_role DEFAULT 'free_user',
    verification_level verification_level DEFAULT 'none',
    account_status account_status DEFAULT 'active',
    subscription_id UUID,  -- FK to subscriptions table
    -- Profile Settings
    profile_visibility VARCHAR(20) DEFAULT 'public',  -- public, connections, private
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(20),
    website_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    -- Metrics
    connection_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    ce_credits_earned DECIMAL(6, 2) DEFAULT 0,
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    last_active_at TIMESTAMP,
    deactivated_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_state, location_city);
CREATE INDEX idx_users_specialty ON users(primary_specialty);
CREATE INDEX idx_users_primary_role ON users(primary_role);
CREATE INDEX idx_users_status ON users(account_status);

-- OAuth / Social Login Providers
CREATE TABLE user_oauth_providers (
    oauth_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,  -- google, apple, linkedin
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- Login Sessions &amp; Audit
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_type VARCHAR(50),  -- ios, android, web
    device_info TEXT,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);
</code></pre><h3>4.1.2 Professional Profile</h3><pre><code class="language-sql">-- ============================================================
-- PROFESSIONAL PROFILE
-- ============================================================

CREATE TABLE user_education (
    education_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,  -- ADN, BSN, MSN, DNP, PhD, etc.
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(3, 2),
    honors VARCHAR(255),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_experience (
    experience_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    employer_logo_url VARCHAR(500),
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    specialty VARCHAR(255),
    employment_type VARCHAR(50),  -- full_time, part_time, contract, travel, per_diem
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),  -- clinical, technical, leadership, etc.
    endorsement_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name)
);

CREATE TABLE skill_endorsements (
    endorsement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES user_skills(skill_id) ON DELETE CASCADE,
    endorser_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(skill_id, endorser_id)
);

CREATE TABLE user_awards (
    award_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    date_received DATE,
    description TEXT,
    url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_publications (
    publication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    publisher VARCHAR(255),
    publication_date DATE,
    url VARCHAR(500),
    doi VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_volunteer_experience (
    volunteer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255),
    cause VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</code></pre><h3>4.1.3 Connections &amp; Networking</h3><pre><code class="language-sql">-- ============================================================
-- CONNECTIONS &amp; NETWORKING
-- ============================================================

CREATE TYPE connection_status AS ENUM (
    'pending', 'accepted', 'declined', 'withdrawn', 'blocked'
);

CREATE TABLE connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    status connection_status DEFAULT 'pending',
    connection_note TEXT,  -- Optional message with request
    connection_type VARCHAR(50),  -- colleague, mentor, classmate, other
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, receiver_id),
    CHECK (requester_id != receiver_id)
);

CREATE INDEX idx_connections_requester ON connections(requester_id, status);
CREATE INDEX idx_connections_receiver ON connections(receiver_id, status);
CREATE INDEX idx_connections_status ON connections(status);

CREATE TABLE follows (
    follow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE TABLE blocked_users (
    block_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id)
);

-- Profile Views (for analytics)
CREATE TABLE profile_views (
    view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    viewer_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    viewer_anonymous BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profile_views_profile ON profile_views(profile_user_id, viewed_at DESC);
</code></pre><h3>4.1.4 Certifications &amp; Licenses</h3><pre><code class="language-sql">-- ============================================================
-- CERTIFICATIONS &amp; LICENSES
-- ============================================================

CREATE TYPE cert_status AS ENUM ('active', 'expiring_soon', 'expired', 'revoked');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');

CREATE TABLE certification_types (
    cert_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,  -- BLS, ACLS, PALS, CCRN, etc.
    full_name VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,  -- life_support, specialty, advanced_practice
    typical_validity_months INTEGER,  -- e.g., 24 for BLS
    issuing_bodies TEXT[],  -- {AHA, Red Cross, NHCPS}
    description TEXT,
    renewal_requirements TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_certifications (
    certification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    cert_type_id UUID REFERENCES certification_types(cert_type_id),
    custom_name VARCHAR(255),  -- For non-standard certifications
    issuing_body VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),
    date_earned DATE NOT NULL,
    expiration_date DATE,
    status cert_status DEFAULT 'active',
    verification_status verification_status DEFAULT 'unverified',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(user_id),
    document_url VARCHAR(500),  -- S3 path to uploaded certificate
    document_ocr_data JSONB,  -- Extracted OCR data
    show_on_profile BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_certs_user ON user_certifications(user_id);
CREATE INDEX idx_user_certs_expiry ON user_certifications(expiration_date);
CREATE INDEX idx_user_certs_status ON user_certifications(status);

CREATE TABLE nursing_licenses (
    license_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    license_type VARCHAR(50) NOT NULL,  -- RN, LPN, LVN, NP, APRN, CNA
    license_number VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    is_compact BOOLEAN DEFAULT FALSE,  -- Nurse Licensure Compact
    compact_states TEXT[],  -- States covered by compact license
    issue_date DATE,
    expiration_date DATE NOT NULL,
    status cert_status DEFAULT 'active',
    verification_status verification_status DEFAULT 'unverified',
    nursys_verified BOOLEAN DEFAULT FALSE,
    nursys_verified_at TIMESTAMP,
    document_url VARCHAR(500),
    ce_requirements_met BOOLEAN DEFAULT FALSE,
    show_on_profile BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_licenses_user ON nursing_licenses(user_id);
CREATE INDEX idx_licenses_expiry ON nursing_licenses(expiration_date);

-- Expiration Alert Schedule
CREATE TABLE cert_expiration_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    certification_id UUID REFERENCES user_certifications(certification_id) ON DELETE CASCADE,
    license_id UUID REFERENCES nursing_licenses(license_id) ON DELETE CASCADE,
    alert_type VARCHAR(20) NOT NULL,  -- email, push, sms
    days_before_expiry INTEGER NOT NULL,  -- 90, 60, 30, 14, 7, 0
    scheduled_date DATE NOT NULL,
    sent_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (certification_id IS NOT NULL OR license_id IS NOT NULL)
);

CREATE INDEX idx_alerts_scheduled ON cert_expiration_alerts(scheduled_date, is_sent);
</code></pre><h3>4.1.5 Learning Management System</h3><pre><code class="language-sql">-- ============================================================
-- LEARNING MANAGEMENT SYSTEM
-- ============================================================

CREATE TYPE course_status AS ENUM ('draft', 'in_review', 'published', 'archived', 'suspended');
CREATE TYPE content_format AS ENUM ('video', 'interactive', 'text', 'pdf', 'scorm', 'xapi', 'quiz', 'case_study', 'simulation');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'in_progress', 'completed', 'dropped', 'expired');

-- Course Categories &amp; Specialties
CREATE TABLE course_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_category_id UUID REFERENCES course_categories(category_id),
    description TEXT,
    icon_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses (Top-Level Container)
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Basic Info
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    subtitle VARCHAR(500),
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    thumbnail_url VARCHAR(500),
    preview_video_url VARCHAR(500),
    -- Classification
    category_id UUID REFERENCES course_categories(category_id),
    specialty VARCHAR(255),
    difficulty difficulty_level DEFAULT 'intermediate',
    tags TEXT[],
    -- CE Credit Info
    ce_credit_hours DECIMAL(5, 2),
    ce_credit_type VARCHAR(100),  -- ANCC, AACN, state-specific
    accreditation_body VARCHAR(255),
    accreditation_statement TEXT,
    accreditation_number VARCHAR(100),
    -- Pricing
    is_free BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0,  -- Price in cents (0 = free)
    subscription_tier_required VARCHAR(50),  -- null, premium, pro
    -- Instructor
    instructor_id UUID REFERENCES users(user_id),
    co_instructor_ids UUID[],
    -- Content Structure
    total_modules INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    estimated_duration_minutes INTEGER,  -- Total estimated time
    -- Requirements
    prerequisites TEXT[],  -- Course IDs or text descriptions
    target_audience TEXT,
    learning_objectives TEXT[],
    -- Status &amp; Publishing
    status course_status DEFAULT 'draft',
    published_at TIMESTAMP,
    last_updated_content_at TIMESTAMP,
    -- Metrics
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    -- Metadata
    version VARCHAR(20) DEFAULT '1.0',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_specialty ON courses(specialty);
CREATE INDEX idx_courses_free ON courses(is_free);

-- Course Modules (Sections within a Course)
CREATE TABLE course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    estimated_duration_minutes INTEGER,
    is_published BOOLEAN DEFAULT TRUE,
    unlock_after_module_id UUID REFERENCES course_modules(module_id),  -- Sequential unlock
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons (Individual Content Items within Modules)
CREATE TABLE course_lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_format content_format NOT NULL,
    -- Content References
    video_url VARCHAR(500),
    video_duration_seconds INTEGER,
    video_transcript TEXT,
    text_content TEXT,  -- For text/article lessons
    pdf_url VARCHAR(500),
    scorm_package_url VARCHAR(500),
    xapi_endpoint VARCHAR(500),
    interactive_content_url VARCHAR(500),
    -- Settings
    display_order INTEGER NOT NULL,
    estimated_duration_minutes INTEGER,
    is_preview BOOLEAN DEFAULT FALSE,  -- Free preview lesson
    is_published BOOLEAN DEFAULT TRUE,
    is_mandatory BOOLEAN DEFAULT TRUE,  -- Required for course completion
    -- Completion Criteria
    completion_type VARCHAR(50) DEFAULT 'view',  -- view, quiz_pass, time_spent, manual
    min_time_seconds INTEGER,  -- Minimum time to mark as complete
    min_quiz_score DECIMAL(5, 2),  -- Minimum quiz score (percentage)
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_module ON course_lessons(module_id, display_order);
CREATE INDEX idx_lessons_course ON course_lessons(course_id);

-- Quizzes &amp; Assessments
CREATE TABLE quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    quiz_type VARCHAR(50) DEFAULT 'graded',  -- graded, practice, survey
    passing_score DECIMAL(5, 2) DEFAULT 70.00,  -- Percentage
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 3,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    show_correct_after VARCHAR(50) DEFAULT 'submission',  -- submission, all_attempts, never
    total_questions INTEGER DEFAULT 0,
    total_points DECIMAL(6, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,  -- multiple_choice, true_false, multi_select, fill_blank, matching, ordering
    explanation TEXT,  -- Explanation shown after answering
    points DECIMAL(5, 2) DEFAULT 1.00,
    display_order INTEGER NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_answers (
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    display_order INTEGER NOT NULL,
    feedback TEXT,  -- Specific feedback for this answer choice
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Enrollments &amp; Progress
CREATE TABLE course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    dropped_at TIMESTAMP,
    expires_at TIMESTAMP,  -- For time-limited access
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    total_time_spent_seconds INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    last_lesson_id UUID REFERENCES course_lessons(lesson_id),
    -- Completion
    final_quiz_score DECIMAL(5, 2),
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_id UUID,
    ce_credits_awarded DECIMAL(5, 2) DEFAULT 0,
    -- Payment
    payment_id UUID,
    amount_paid_cents INTEGER DEFAULT 0,
    subscription_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id, status);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- Lesson Progress (per-lesson tracking)
CREATE TABLE lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    video_position_seconds INTEGER DEFAULT 0,  -- Resume position
    attempts INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    score DECIMAL(5, 2),  -- Percentage
    points_earned DECIMAL(6, 2),
    total_points DECIMAL(6, 2),
    passed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER,
    answers JSONB,  -- {question_id: {selected_answer_ids: [], is_correct: bool}}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates &amp; CE Credits
CREATE TABLE course_certificates (
    certificate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES course_enrollments(enrollment_id),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    certificate_url VARCHAR(500),  -- PDF URL
    ce_credits DECIMAL(5, 2),
    ce_credit_type VARCHAR(100),
    accreditation_body VARCHAR(255),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    verification_code VARCHAR(50) UNIQUE,  -- Public verification code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Reviews &amp; Ratings
CREATE TABLE course_reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating &gt;= 1 AND rating &lt;= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_completion BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);
</code></pre><h3>4.1.6 Subscriptions &amp; Billing</h3><pre><code class="language-sql">-- ============================================================
-- SUBSCRIPTIONS &amp; BILLING
-- ============================================================

CREATE TYPE subscription_status AS ENUM (
    'trialing', 'active', 'past_due', 'canceled', 'expired', 'paused'
);

CREATE TYPE billing_interval AS ENUM ('monthly', 'quarterly', 'annual');

CREATE TABLE subscription_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Plan Identity
    name VARCHAR(100) NOT NULL,  -- Free, Premium, Professional, Enterprise
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    tier_level INTEGER NOT NULL,  -- 0=Free, 1=Premium, 2=Pro, 3=Enterprise
    -- Pricing
    monthly_price_cents INTEGER NOT NULL DEFAULT 0,
    quarterly_price_cents INTEGER,
    annual_price_cents INTEGER,
    -- Stripe Integration
    stripe_monthly_price_id VARCHAR(255),
    stripe_quarterly_price_id VARCHAR(255),
    stripe_annual_price_id VARCHAR(255),
    stripe_product_id VARCHAR(255),
    -- Features &amp; Limits
    features JSONB NOT NULL DEFAULT '{}',
    /*
    Example features JSONB:
    {
        "max_connections": -1,          // -1 = unlimited
        "max_messages_per_month": 50,   // -1 = unlimited
        "ce_courses_included": 5,       // -1 = unlimited
        "premium_courses_access": false,
        "certification_tracking": true,
        "course_finder": true,
        "medical_reference_access": "basic",  // basic, full
        "study_groups": 3,              // max groups
        "forum_posts_per_month": 20,    // -1 = unlimited
        "profile_badge": "free",        // free, premium, pro, enterprise
        "analytics_dashboard": false,
        "priority_support": false,
        "api_access": false,
        "custom_branding": false,
        "team_management": false,
        "bulk_enrollment": false,
        "advanced_reporting": false,
        "mentorship_access": false,
        "offline_access": false,
        "ad_free": false
    }
    */
    -- Trial
    trial_days INTEGER DEFAULT 0,
    -- Display
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(plan_id),
    -- Status
    status subscription_status DEFAULT 'trialing',
    billing_interval billing_interval DEFAULT 'monthly',
    -- Dates
    trial_start_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    canceled_at TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    -- Stripe
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    -- Payment
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id, status);
CREATE INDEX idx_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);

CREATE TABLE payment_history (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(subscription_id),
    -- Payment Details
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(50) NOT NULL,  -- subscription, course_purchase, one_time
    payment_method VARCHAR(50),  -- card, paypal, etc.
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    -- Status
    status VARCHAR(50) NOT NULL,  -- succeeded, failed, refunded, pending
    failure_reason TEXT,
    refunded_at TIMESTAMP,
    refund_amount_cents INTEGER,
    -- Item
    item_type VARCHAR(50),  -- subscription, course
    item_id UUID,
    item_description VARCHAR(500),
    -- Metadata
    receipt_url VARCHAR(500),
    invoice_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupon / Promo Codes
CREATE TABLE promo_codes (
    promo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,  -- percentage, fixed_amount
    discount_value DECIMAL(10, 2) NOT NULL,  -- Percentage or cents
    applicable_plans UUID[],  -- Null = all plans
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</code></pre><h3>4.1.7 Course Finder (Location-Based)</h3><pre><code class="language-sql">-- ============================================================
-- RECERTIFICATION COURSE FINDER
-- ============================================================

CREATE TABLE course_providers (
    provider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    description TEXT,
    provider_type VARCHAR(100),  -- aha_training_center, red_cross, independent, hospital
    is_verified BOOLEAN DEFAULT FALSE,
    accreditations TEXT[],
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recert_courses (
    recert_course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES course_providers(provider_id) ON DELETE CASCADE,
    cert_type_id UUID REFERENCES certification_types(cert_type_id),
    -- Course Info
    title VARCHAR(500) NOT NULL,
    description TEXT,
    format VARCHAR(50) NOT NULL,  -- in_person, online, blended
    -- Location (for in-person/blended)
    location_name VARCHAR(255),
    location_address VARCHAR(500),
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(10),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_point GEOGRAPHY(POINT, 4326),  -- PostGIS for geo queries
    -- Schedule
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP,
    duration_hours DECIMAL(4, 1),
    -- Capacity &amp; Pricing
    price_cents INTEGER,
    max_capacity INTEGER,
    spots_remaining INTEGER,
    -- Registration
    registration_url VARCHAR(500),
    registration_deadline TIMESTAMP,
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP,
    source VARCHAR(100),  -- manual, aha_api, red_cross_scrape, provider_portal
    external_id VARCHAR(255),  -- ID from source system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PostGIS index for location-based queries
CREATE INDEX idx_recert_courses_location ON recert_courses USING GIST(location_point);
CREATE INDEX idx_recert_courses_cert_type ON recert_courses(cert_type_id, start_datetime);
CREATE INDEX idx_recert_courses_datetime ON recert_courses(start_datetime);

CREATE TABLE course_provider_reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES course_providers(provider_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    recert_course_id UUID REFERENCES recert_courses(recert_course_id),
    rating INTEGER NOT NULL CHECK (rating &gt;= 1 AND rating &lt;= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recert_course_id)
);
</code></pre><h2>4.2 MongoDB Schema (Document Data)</h2><pre><code class="language-javascript">// ============================================================
// ACTIVITY FEED / POSTS
// ============================================================
// Collection: posts
{
  _id: ObjectId,
  author_id: String,  // UUID from PostgreSQL
  post_type: String,  // "text", "article", "image", "poll", "course_share", "cert_achievement"
  content: {
    text: String,
    rich_text: String,  // HTML/Markdown
    images: [{ url: String, alt: String, width: Number, height: Number }],
    links: [{ url: String, title: String, description: String, image: String }],
    poll: {
      question: String,
      options: [{ id: String, text: String, votes: Number }],
      expires_at: Date,
      total_votes: Number
    },
    shared_course_id: String,
    shared_article_id: String,
    achievement: {
      type: String,  // "certification_earned", "course_completed", "connection_milestone"
      details: Object
    }
  },
  visibility: String,  // "public", "connections", "private"
  tags: [String],
  specialty_tags: [String],
  // Engagement
  like_count: Number,
  comment_count: Number,
  share_count: Number,
  view_count: Number,
  // Moderation
  is_flagged: Boolean,
  flag_count: Number,
  is_hidden: Boolean,
  moderation_status: String,  // "approved", "pending", "rejected"
  // Timestamps
  created_at: Date,
  updated_at: Date,
  edited_at: Date
}

// Collection: comments
{
  _id: ObjectId,
  post_id: ObjectId,
  parent_comment_id: ObjectId,  // For nested replies
  author_id: String,
  content: String,
  like_count: Number,
  is_flagged: Boolean,
  created_at: Date,
  updated_at: Date
}

// ============================================================
// MESSAGES
// ============================================================
// Collection: conversations
{
  _id: ObjectId,
  type: String,  // "direct", "group"
  participants: [String],  // User IDs
  group_name: String,  // For group conversations
  group_avatar_url: String,
  last_message: {
    sender_id: String,
    content_preview: String,
    sent_at: Date
  },
  created_at: Date,
  updated_at: Date
}

// Collection: messages
{
  _id: ObjectId,
  conversation_id: ObjectId,
  sender_id: String,
  content: {
    text: String,
    attachments: [{ type: String, url: String, name: String, size: Number }]
  },
  read_by: [{ user_id: String, read_at: Date }],
  is_deleted: Boolean,
  created_at: Date
}

// ============================================================
// MEDICAL REFERENCE ARTICLES
// ============================================================
// Collection: medical_articles
{
  _id: ObjectId,
  title: String,
  slug: String,
  specialty: String,
  category: String,
  subcategory: String,
  content: {
    summary: String,
    sections: [
      {
        heading: String,
        body: String,  // Rich text with inline citation markers [1], [2]
        order: Number
      }
    ],
    key_points: [String],
    nursing_considerations: String
  },
  citations: [
    {
      number: Number,
      authors: [String],
      title: String,
      journal: String,
      year: Number,
      volume: String,
      issue: String,
      pages: String,
      doi: String,
      pubmed_id: String,
      url: String,
      evidence_level: String,
      access_type: String,  // "free", "paywall", "open_access"
      last_verified: Date,
      is_accessible: Boolean
    }
  ],
  metadata: {
    author: { user_id: String, name: String, credentials: String },
    reviewers: [{ user_id: String, name: String, credentials: String, reviewed_at: Date }],
    advisory_board_approved: Boolean,
    approved_by: String,
    approved_at: Date,
    evidence_grade: String,
    version: Number,
    status: String,  // "draft", "in_review", "published", "archived"
    created_at: Date,
    updated_at: Date,
    last_reviewed_at: Date,
    next_review_date: Date,
    review_cycle_months: Number
  },
  tags: [String],
  related_article_ids: [ObjectId],
  related_course_ids: [String],  // Links to relevant CE courses
  view_count: Number,
  bookmark_count: Number,
  share_count: Number
}

// ============================================================
// FORUM / Q&amp;A
// ============================================================
// Collection: forum_threads
{
  _id: ObjectId,
  author_id: String,
  title: String,
  body: String,
  thread_type: String,  // "question", "discussion", "case_study", "resource_share"
  specialty: String,
  tags: [String],
  upvotes: Number,
  downvotes: Number,
  answer_count: Number,
  view_count: Number,
  is_resolved: Boolean,
  best_answer_id: ObjectId,
  is_pinned: Boolean,
  is_locked: Boolean,
  moderation_status: String,
  phi_scan_passed: Boolean,
  created_at: Date,
  updated_at: Date
}

// Collection: forum_answers
{
  _id: ObjectId,
  thread_id: ObjectId,
  author_id: String,
  body: String,
  citations: [
    { number: Number, title: String, url: String, source: String }
  ],
  upvotes: Number,
  downvotes: Number,
  is_best_answer: Boolean,
  is_expert_verified: Boolean,
  expert_verified_by: String,
  moderation_status: String,
  created_at: Date,
  updated_at: Date
}

// ============================================================
// NOTIFICATIONS
// ============================================================
// Collection: notifications
{
  _id: ObjectId,
  user_id: String,
  type: String,  // "cert_expiring", "connection_request", "message", "course_complete", etc.
  title: String,
  body: String,
  data: Object,  // Type-specific payload
  channels: [String],  // ["email", "push", "sms", "in_app"]
  channel_status: {
    email: { sent: Boolean, sent_at: Date },
    push: { sent: Boolean, sent_at: Date },
    sms: { sent: Boolean, sent_at: Date },
    in_app: { delivered: Boolean }
  },
  is_read: Boolean,
  read_at: Date,
  action_url: String,
  created_at: Date,
  expires_at: Date
}
</code></pre><hr><h1>5. FEATURE SPECIFICATION: PROFESSIONAL NETWORKING</h1><h2>5.1 User Profile System</h2><h3>5.1.1 Profile Sections</h3><table class="e-rte-table"> <thead> <tr> <th>Section</th> <th>Description</th> <th>Visibility Control</th> </tr> </thead> <tbody><tr> <td><strong>Header</strong></td> <td>Photo, cover image, name, headline, location, verification badges</td> <td>Always visible</td> </tr> <tr> <td><strong>About</strong></td> <td>Bio/summary (up to 2,600 characters)</td> <td>Configurable</td> </tr> <tr> <td><strong>Credentials</strong></td> <td>Verified licenses and certifications with badges</td> <td>Configurable</td> </tr> <tr> <td><strong>Experience</strong></td> <td>Work history with employer, title, dates, description</td> <td>Configurable</td> </tr> <tr> <td><strong>Education</strong></td> <td>Degrees, institutions, dates, honors</td> <td>Configurable</td> </tr> <tr> <td><strong>Skills &amp; Endorsements</strong></td> <td>Skills list with endorsement counts from connections</td> <td>Configurable</td> </tr> <tr> <td><strong>CE &amp; Learning</strong></td> <td>Completed courses, CE credits earned, learning badges</td> <td>Configurable</td> </tr> <tr> <td><strong>Publications</strong></td> <td>Research papers, articles, presentations</td> <td>Configurable</td> </tr> <tr> <td><strong>Awards &amp; Honors</strong></td> <td>Professional awards, recognitions</td> <td>Configurable</td> </tr> <tr> <td><strong>Volunteer Experience</strong></td> <td>Community service, mission trips</td> <td>Configurable</td> </tr> <tr> <td><strong>Activity Feed</strong></td> <td>Recent posts, comments, shares</td> <td>Configurable</td> </tr> </tbody></table><h3>5.1.2 Verification Badge System</h3><table class="e-rte-table"> <thead> <tr> <th>Badge</th> <th>Criteria</th> <th>Visual</th> </tr> </thead> <tbody><tr> <td><strong>Email Verified</strong></td> <td>Email confirmed</td> <td>✉️ Blue checkmark</td> </tr> <tr> <td><strong>License Verified</strong></td> <td>Nursing license verified via NURSYS or manual review</td> <td>🛡️ Green shield</td> </tr> <tr> <td><strong>Certification Verified</strong></td> <td>BLS/ACLS/etc. verified via document review</td> <td>📋 Gold certificate</td> </tr> <tr> <td><strong>Fully Verified</strong></td> <td>Email + License + at least one certification verified</td> <td>⭐ Gold star badge</td> </tr> <tr> <td><strong>Premium Member</strong></td> <td>Active premium subscription</td> <td>💎 Diamond badge</td> </tr> <tr> <td><strong>Instructor</strong></td> <td>Approved course instructor</td> <td>🎓 Graduation cap</td> </tr> <tr> <td><strong>Expert Contributor</strong></td> <td>50+ verified forum answers with high ratings</td> <td>🏆 Trophy badge</td> </tr> </tbody></table><h2>5.2 Connection System</h2><h3>5.2.1 Connection Features</h3><ul> <li><strong>Send Connection Request</strong> with optional personalized note (300 char limit)</li> <li><strong>Accept/Decline/Withdraw</strong> connection requests</li> <li><strong>Connection Suggestions</strong> ("People You May Know") powered by:<ul> <li>Same employer (current or past)</li> <li>Same specialty</li> <li>Same nursing school</li> <li>Same geographic area</li> <li>Mutual connections (2nd-degree)</li> <li>Same study groups or forum activity</li> </ul> </li> <li><strong>Connection Degree Display:</strong> 1st, 2nd, 3rd+ degree</li> <li><strong>Follow</strong> (one-way) for thought leaders without mutual connection</li> <li><strong>Block</strong> users (hides all interactions)</li> </ul><h3>5.2.2 "People You May Know" Algorithm</h3><pre><code>Score = (W1 × SharedEmployer) + (W2 × SharedSpecialty) + (W3 × SharedSchool) 
      + (W4 × GeoProximity) + (W5 × MutualConnections) + (W6 × SharedGroups)
      + (W7 × ProfileCompleteness) + (W8 × ActivityRecency)

Where:
  W1 = 0.25 (Same current employer = highest signal)
  W2 = 0.20 (Same specialty = strong professional relevance)
  W3 = 0.15 (Same school = alumni network)
  W4 = 0.10 (Within 50 miles)
  W5 = 0.15 (Number of mutual connections, normalized)
  W6 = 0.05 (Shared study groups or forum topics)
  W7 = 0.05 (Higher profile completeness = more likely to engage)
  W8 = 0.05 (Recently active users prioritized)
</code></pre><h2>5.3 Activity Feed</h2><h3>5.3.1 Feed Algorithm</h3><p>The feed uses a <strong>relevance-ranked</strong> algorithm (not purely chronological):</p><pre><code>FeedScore = (RelevanceScore × 0.4) + (RecencyScore × 0.3) 
          + (EngagementScore × 0.2) + (RelationshipScore × 0.1)

Where:
  RelevanceScore = Topic match to user's specialty + interests
  RecencyScore = Decay function based on post age (half-life: 24 hours)
  EngagementScore = Normalized (likes + comments + shares) relative to impressions
  RelationshipScore = Connection strength (1st degree &gt; 2nd &gt; followed &gt; other)
</code></pre><h3>5.3.2 Post Types</h3><table class="e-rte-table"> <thead> <tr> <th>Post Type</th> <th>Description</th> <th>Available To</th> </tr> </thead> <tbody><tr> <td><strong>Text Post</strong></td> <td>Plain text with optional formatting</td> <td>All users</td> </tr> <tr> <td><strong>Image Post</strong></td> <td>Text + up to 9 images</td> <td>All users</td> </tr> <tr> <td><strong>Article</strong></td> <td>Long-form content with rich formatting</td> <td>Premium+</td> </tr> <tr> <td><strong>Poll</strong></td> <td>Question with 2-4 options, configurable duration</td> <td>All users</td> </tr> <tr> <td><strong>Course Share</strong></td> <td>Share a course with personal recommendation</td> <td>All users</td> </tr> <tr> <td><strong>Achievement</strong></td> <td>Auto-generated: certification earned, course completed, milestone</td> <td>System-generated</td> </tr> <tr> <td><strong>Event Share</strong></td> <td>Share upcoming CE events or conferences</td> <td>All users</td> </tr> </tbody></table><h2>5.4 Messaging System</h2><ul> <li><strong>Direct Messages:</strong> 1-to-1 HIPAA-compliant messaging between connections</li> <li><strong>Group Messages:</strong> Up to 50 participants (Premium+)</li> <li><strong>Features:</strong> Read receipts, typing indicators, file sharing (images, PDFs — no PHI), message search, message reactions</li> <li><strong>Real-time:</strong> WebSocket-based delivery with offline queue</li> <li><strong>Limits by Tier:</strong><ul> <li>Free: 15 messages/month to non-connections (InMail equivalent)</li> <li>Premium: 50 messages/month to non-connections</li> <li>Pro: Unlimited</li> <li>Enterprise: Unlimited + team messaging</li> </ul> </li> </ul><hr><h1>6. FEATURE SPECIFICATION: LEARNING MANAGEMENT SYSTEM</h1><h2>6.1 LMS Architecture</h2><h3>6.1.1 Content Hierarchy</h3><pre><code>Platform
  └── Course Categories (e.g., "Critical Care," "Pharmacology," "Leadership")
        └── Courses (e.g., "Advanced Cardiac Life Support Review")
              └── Modules (e.g., "Module 1: Cardiac Rhythms")
                    └── Lessons (e.g., "Lesson 1.3: Identifying V-Tach")
                          ├── Video Content
                          ├── Text/Article Content
                          ├── Interactive Simulations
                          ├── Downloadable Resources (PDFs)
                          └── Quizzes/Assessments
</code></pre><h3>6.1.2 Content Standards Support</h3><table class="e-rte-table"> <thead> <tr> <th>Standard</th> <th>Support Level</th> <th>Use Case</th> </tr> </thead> <tbody><tr> <td><strong>SCORM 1.2</strong></td> <td>Full</td> <td>Legacy content packages from existing providers</td> </tr> <tr> <td><strong>SCORM 2004</strong></td> <td>Full</td> <td>Advanced sequencing and navigation</td> </tr> <tr> <td><strong>xAPI (Tin Can)</strong></td> <td>Full</td> <td>Modern learning analytics, mobile learning, simulations</td> </tr> <tr> <td><strong>cmi5</strong></td> <td>Planned (Phase 3)</td> <td>Next-gen standard combining SCORM + xAPI benefits</td> </tr> <tr> <td><strong>LTI 1.3</strong></td> <td>Full</td> <td>Integration with external learning tools and content providers</td> </tr> </tbody></table><h2>6.2 Course Features</h2><h3>6.2.1 Course Creation (Instructor Portal)</h3><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>Description</th> </tr> </thead> <tbody><tr> <td><strong>Course Builder</strong></td> <td>Drag-and-drop module/lesson organizer</td> </tr> <tr> <td><strong>Video Upload</strong></td> <td>Direct upload with automatic transcoding to adaptive bitrate (HLS)</td> </tr> <tr> <td><strong>Rich Text Editor</strong></td> <td>Tiptap-based editor for text lessons with image embedding, code blocks, tables</td> </tr> <tr> <td><strong>Quiz Builder</strong></td> <td>Create quizzes with 6 question types: multiple choice, true/false, multi-select, fill-in-blank, matching, ordering</td> </tr> <tr> <td><strong>Resource Library</strong></td> <td>Upload supplementary PDFs, documents, links</td> </tr> <tr> <td><strong>Preview Mode</strong></td> <td>Preview course as a student before publishing</td> </tr> <tr> <td><strong>Analytics Dashboard</strong></td> <td>Enrollment, completion rates, quiz scores, student feedback</td> </tr> <tr> <td><strong>Drip Content</strong></td> <td>Schedule module releases over time</td> </tr> <tr> <td><strong>Prerequisites</strong></td> <td>Set required courses or modules before access</td> </tr> <tr> <td><strong>Co-Instructors</strong></td> <td>Invite collaborating instructors</td> </tr> </tbody></table><h3>6.2.2 Student Learning Experience</h3><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>Description</th> </tr> </thead> <tbody><tr> <td><strong>Course Catalog</strong></td> <td>Browse/search courses by category, specialty, difficulty, format, price, rating</td> </tr> <tr> <td><strong>Course Preview</strong></td> <td>Free preview lessons, course description, instructor bio, reviews</td> </tr> <tr> <td><strong>Enrollment</strong></td> <td>One-click enrollment (free) or purchase flow (paid)</td> </tr> <tr> <td><strong>Progress Dashboard</strong></td> <td>Visual progress bar, completed/remaining lessons, time spent</td> </tr> <tr> <td><strong>Video Player</strong></td> <td>Adaptive streaming, playback speed control (0.5x–2x), captions, bookmarks, notes</td> </tr> <tr> <td><strong>Resume Learning</strong></td> <td>Automatically resume from last position</td> </tr> <tr> <td><strong>Notes &amp; Highlights</strong></td> <td>Take notes alongside lessons, highlight text content</td> </tr> <tr> <td><strong>Offline Access</strong></td> <td>Download lessons for offline viewing (Premium+)</td> </tr> <tr> <td><strong>Discussion</strong></td> <td>Per-lesson discussion threads for Q&amp;A with instructor and peers</td> </tr> <tr> <td><strong>Certificates</strong></td> <td>Auto-generated PDF certificate upon completion with verification code</td> </tr> <tr> <td><strong>CE Credit Tracking</strong></td> <td>Automatic CE credit logging to user's transcript</td> </tr> </tbody></table><h3>6.2.3 Assessment &amp; Grading</h3><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>Description</th> </tr> </thead> <tbody><tr> <td><strong>Quiz Types</strong></td> <td>Graded (counts toward completion), Practice (no grade impact), Survey (feedback)</td> </tr> <tr> <td><strong>Question Bank</strong></td> <td>Randomized question selection from a larger pool</td> </tr> <tr> <td><strong>Timed Quizzes</strong></td> <td>Optional time limits with auto-submission</td> </tr> <tr> <td><strong>Multiple Attempts</strong></td> <td>Configurable max attempts (default: 3)</td> </tr> <tr> <td><strong>Instant Feedback</strong></td> <td>Show correct answers and explanations after submission</td> </tr> <tr> <td><strong>Passing Score</strong></td> <td>Configurable per quiz (default: 70%)</td> </tr> <tr> <td><strong>Score History</strong></td> <td>Track all attempts with scores and timestamps</td> </tr> <tr> <td><strong>Proctoring</strong></td> <td>Basic proctoring (tab-switch detection) for high-stakes assessments (Phase 3)</td> </tr> </tbody></table><h2>6.3 CE Credit Management</h2><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>Description</th> </tr> </thead> <tbody><tr> <td><strong>Automatic Tracking</strong></td> <td>CE credits auto-logged upon course completion</td> </tr> <tr> <td><strong>Transcript</strong></td> <td>Comprehensive CE transcript with all credits, dates, accreditation info</td> </tr> <tr> <td><strong>State Mapping</strong></td> <td>Map courses to state-specific CE requirements</td> </tr> <tr> <td><strong>Export</strong></td> <td>Export transcript as PDF for license renewal submissions</td> </tr> <tr> <td><strong>Accreditation Display</strong></td> <td>Show accreditation body, statement, and number on all certificates</td> </tr> <tr> <td><strong>Credit Types</strong></td> <td>Support multiple credit types: ANCC, AACN, state-specific, pharmacology, etc.</td> </tr> <tr> <td><strong>Compliance Dashboard</strong></td> <td>Visual tracker showing CE progress toward license renewal requirements</td> </tr> </tbody></table><h2>6.4 Learning Analytics</h2><table class="e-rte-table"> <thead> <tr> <th>Metric</th> <th>Description</th> <th>Available To</th> </tr> </thead> <tbody><tr> <td><strong>Personal Dashboard</strong></td> <td>Courses in progress, completion rate, time spent, CE credits</td> <td>All users</td> </tr> <tr> <td><strong>Learning Streak</strong></td> <td>Consecutive days of learning activity (gamification)</td> <td>All users</td> </tr> <tr> <td><strong>Skill Radar</strong></td> <td>Visual chart of skills developed across specialties</td> <td>Premium+</td> </tr> <tr> <td><strong>Leaderboard</strong></td> <td>Optional community leaderboard by CE credits earned</td> <td>All users</td> </tr> <tr> <td><strong>Instructor Analytics</strong></td> <td>Enrollment trends, completion rates, quiz performance, revenue</td> <td>Instructors</td> </tr> <tr> <td><strong>Enterprise Analytics</strong></td> <td>Team progress, compliance rates, skill gaps, ROI</td> <td>Enterprise</td> </tr> </tbody></table><hr><h1>7. FEATURE SPECIFICATION: CERTIFICATION TRACKING &amp; COURSE FINDER</h1><p><em>These features are carried forward from our prior requirements document with enhancements.</em></p><h2>7.1 Certification Tracking — Enhanced</h2><p>All requirements from the prior document (CERT-001 through CERT-016) are incorporated, plus:</p><table class="e-rte-table"> <thead> <tr> <th>New Requirement</th> <th>Description</th> <th>Priority</th> </tr> </thead> <tbody><tr> <td>CERT-017</td> <td>Integration with LMS: when a user completes a certification review course, prompt to update certification record</td> <td>P1</td> </tr> <tr> <td>CERT-018</td> <td>Certification sharing: generate a shareable verification link for employers</td> <td>P1</td> </tr> <tr> <td>CERT-019</td> <td>Bulk import: upload multiple certificates at once (ZIP file with OCR processing)</td> <td>P2</td> </tr> <tr> <td>CERT-020</td> <td>Certification comparison: see which certifications peers in your specialty hold</td> <td>P2</td> </tr> </tbody></table><h2>7.2 Location-Based Course Finder — Enhanced</h2><p>All requirements from the prior document (LOC-001 through LOC-015) are incorporated, plus:</p><table class="e-rte-table"> <thead> <tr> <th>New Requirement</th> <th>Description</th> <th>Priority</th> </tr> </thead> <tbody><tr> <td>LOC-016</td> <td>Integration with LMS: recommend online refresher courses alongside in-person recertification</td> <td>P1</td> </tr> <tr> <td>LOC-017</td> <td>Group registration: coordinate recertification with colleagues (study group integration)</td> <td>P2</td> </tr> <tr> <td>LOC-018</td> <td>Employer-sponsored courses: flag courses that user's employer may reimburse</td> <td>P2</td> </tr> </tbody></table><hr><h1>8. FEATURE SPECIFICATION: VERIFIED MEDICAL REFERENCE LIBRARY</h1><p><em>All requirements from the prior document (EDU-009 through EDU-020, CIT-001 through CIT-010) are incorporated, plus:</em></p><h2>8.1 Enhanced Integration with LMS</h2><table class="e-rte-table"> <thead> <tr> <th>Requirement</th> <th>Description</th> <th>Priority</th> </tr> </thead> <tbody><tr> <td>REF-001</td> <td>Cross-link reference articles to relevant CE courses ("Learn more about this topic → Take this course")</td> <td>P1</td> </tr> <tr> <td>REF-002</td> <td>"Quick Reference" cards: condensed clinical reference cards accessible during course lessons</td> <td>P1</td> </tr> <tr> <td>REF-003</td> <td>Article-to-quiz: auto-generate practice questions from reference article content (AI-assisted)</td> <td>P2</td> </tr> <tr> <td>REF-004</td> <td>Bookmarked articles appear in user's "Learning Library" alongside enrolled courses</td> <td>P1</td> </tr> </tbody></table><hr><h1>9. SUBSCRIPTION &amp; PRICING MODEL</h1><h2>9.1 Tier Structure</h2><h3>9.1.1 Detailed Plan Comparison</h3><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>🆓 Free</th> <th>💎 Premium</th> <th>🚀 Professional</th> <th>🏢 Enterprise</th> </tr> </thead> <tbody><tr> <td><strong>Monthly Price</strong></td> <td>$0</td> <td>$14.99/mo</td> <td>$29.99/mo</td> <td>Custom</td> </tr> <tr> <td><strong>Annual Price</strong></td> <td>$0</td> <td>$119.99/yr ($10/mo)</td> <td>$249.99/yr ($20.83/mo)</td> <td>Custom</td> </tr> <tr> <td><strong>Savings (Annual)</strong></td> <td>—</td> <td>33% off</td> <td>31% off</td> <td>Volume discount</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>NETWORKING</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Professional Profile</td> <td>✅ Basic</td> <td>✅ Enhanced</td> <td>✅ Full</td> <td>✅ Full + Branding</td> </tr> <tr> <td>Connections</td> <td>500 max</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>InMail (msg non-connections)</td> <td>5/month</td> <td>30/month</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>"Who Viewed Your Profile"</td> <td>Last 5</td> <td>Full list (90 days)</td> <td>Full list + analytics</td> <td>Full list + analytics</td> </tr> <tr> <td>Profile Badges</td> <td>Standard</td> <td>💎 Premium badge</td> <td>🚀 Pro badge</td> <td>🏢 Enterprise badge</td> </tr> <tr> <td>Advanced Search Filters</td> <td>Basic</td> <td>✅ Full</td> <td>✅ Full + saved searches</td> <td>✅ Full + team search</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>LEARNING (LMS)</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Free CE Courses</td> <td>✅ All free courses</td> <td>✅ All free courses</td> <td>✅ All free courses</td> <td>✅ All free courses</td> </tr> <tr> <td>Premium CE Courses</td> <td>❌ (pay per course)</td> <td>10/month included</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Certification Review Courses</td> <td>❌ (pay per course)</td> <td>2/year included</td> <td>Unlimited</td> <td>Unlimited + custom</td> </tr> <tr> <td>CE Credit Tracking</td> <td>✅ Basic</td> <td>✅ Full + transcript</td> <td>✅ Full + export</td> <td>✅ Full + reporting</td> </tr> <tr> <td>Course Certificates</td> <td>✅</td> <td>✅</td> <td>✅</td> <td>✅ + custom branding</td> </tr> <tr> <td>Offline Course Access</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td>Learning Analytics</td> <td>Basic progress</td> <td>Detailed dashboard</td> <td>Advanced + skill radar</td> <td>Team analytics + ROI</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>CERTIFICATION TRACKING</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Track Certifications</td> <td>Up to 5</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Track Licenses</td> <td>Up to 2</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Expiration Alerts</td> <td>Email only</td> <td>Email + Push + SMS</td> <td>Email + Push + SMS</td> <td>All + manager alerts</td> </tr> <tr> <td>OCR Document Scanning</td> <td>3/month</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Calendar Integration</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td>Shareable Verification Links</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅ + API access</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>COURSE FINDER</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Location-Based Search</td> <td>✅</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td>Smart Recommendations</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td>Provider Reviews</td> <td>Read only</td> <td>Read + Write</td> <td>Read + Write</td> <td>Read + Write</td> </tr> <tr> <td>Calendar Scheduling</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>MEDICAL REFERENCE</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Reference Articles</td> <td>5/month</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Drug Reference</td> <td>Basic</td> <td>Full + interactions</td> <td>Full + interactions</td> <td>Full + formulary</td> </tr> <tr> <td>Clinical Calculators</td> <td>✅</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td>Offline Access</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>COLLABORATION</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Forum Access</td> <td>Read + 5 posts/mo</td> <td>Unlimited</td> <td>Unlimited</td> <td>Unlimited</td> </tr> <tr> <td>Study Groups</td> <td>Join 2</td> <td>Create/Join 10</td> <td>Unlimited</td> <td>Unlimited + private</td> </tr> <tr> <td>Mentorship Matching</td> <td>❌</td> <td>❌</td> <td>✅</td> <td>✅</td> </tr> <tr> <td><br></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td><strong>SUPPORT</strong></td> <td><br></td> <td><br></td> <td><br></td> <td><br></td> </tr> <tr> <td>Support Level</td> <td>Community</td> <td>Email (48hr)</td> <td>Priority email (24hr)</td> <td>Dedicated CSM</td> </tr> <tr> <td>Ad-Free Experience</td> <td>❌</td> <td>✅</td> <td>✅</td> <td>✅</td> </tr> </tbody></table><h3>9.1.2 Enterprise Plan Details</h3><p>The Enterprise plan is designed for hospitals, healthcare systems, and staffing agencies:</p><table class="e-rte-table"> <thead> <tr> <th>Feature</th> <th>Description</th> </tr> </thead> <tbody><tr> <td><strong>Team Management</strong></td> <td>Admin dashboard to manage team members, assign courses, track compliance</td> </tr> <tr> <td><strong>Bulk Enrollment</strong></td> <td>Enroll entire departments in courses simultaneously</td> </tr> <tr> <td><strong>Compliance Reporting</strong></td> <td>Real-time compliance dashboards showing team certification status</td> </tr> <tr> <td><strong>Custom Courses</strong></td> <td>Upload proprietary training content to the LMS</td> </tr> <tr> <td><strong>SSO Integration</strong></td> <td>SAML 2.0 / OIDC single sign-on with hospital identity providers</td> </tr> <tr> <td><strong>API Access</strong></td> <td>REST API for credential verification and compliance data</td> </tr> <tr> <td><strong>Custom Branding</strong></td> <td>White-label certificates and learning portal</td> </tr> <tr> <td><strong>Dedicated Support</strong></td> <td>Named Customer Success Manager, SLA-backed support</td> </tr> <tr> <td><strong>Volume Pricing</strong></td> <td>Per-seat pricing with volume discounts (typically $15-25/user/month)</td> </tr> <tr> <td><strong>HIPAA BAA</strong></td> <td>Business Associate Agreement included</td> </tr> </tbody></table><h2>9.2 Revenue Model Projections</h2><table class="e-rte-table"> <thead> <tr> <th>Revenue Stream</th> <th>Year 1 Target</th> <th>Year 2 Target</th> </tr> </thead> <tbody><tr> <td>Premium Subscriptions (B2C)</td> <td>$300K</td> <td>$3.0M</td> </tr> <tr> <td>Professional Subscriptions (B2C)</td> <td>$150K</td> <td>$1.5M</td> </tr> <tr> <td>Enterprise Contracts (B2B)</td> <td>$200K</td> <td>$2.0M</td> </tr> <tr> <td>Individual Course Sales</td> <td>$100K</td> <td>$500K</td> </tr> <tr> <td>Course Provider Listings</td> <td>$50K</td> <td>$300K</td> </tr> <tr> <td>Job Board Listings</td> <td>$50K</td> <td>$200K</td> </tr> <tr> <td><strong>Total ARR</strong></td> <td><strong>$850K</strong></td> <td><strong>$7.5M</strong></td> </tr> </tbody></table><h2>9.3 Stripe Integration Architecture</h2><pre><code>User selects plan → Frontend creates Checkout Session via API
  → Backend calls Stripe API to create Checkout Session
    → User redirected to Stripe Checkout (hosted page)
      → User enters payment info
        → Stripe processes payment
          → Stripe sends webhook: checkout.session.completed
            → Backend updates user_subscriptions table
              → Backend updates user.role
                → User redirected to success page with new access

Recurring billing:
  Stripe automatically charges → invoice.paid webhook
    → Backend extends current_period_end
    → Backend sends receipt email

Failed payment:
  Stripe retries (Smart Retries) → invoice.payment_failed webhook
    → Backend sets status = 'past_due'
    → Notification service sends "Update payment method" email
    → After grace period (7 days) → subscription canceled
</code></pre><hr><h1>10. INTEGRATION POINTS: NETWORKING ↔ LEARNING</h1><h2>10.1 Cross-Feature Integration Map</h2><p>This is the key differentiator — seamless integration between networking and learning that no competitor offers:</p><pre><code>┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION TOUCHPOINTS                       │
│                                                                  │
│  NETWORKING ←──────────────────────────────→ LEARNING            │
│                                                                  │
│  1. Profile ←→ Credentials                                      │
│     • Completed courses display on profile                      │
│     • CE credits shown as profile metric                        │
│     • Course certificates = profile badges                      │
│     • Verified certifications from tracking system              │
│                                                                  │
│  2. Feed ←→ Achievements                                        │
│     • Auto-post: "Jane completed ACLS Review Course"            │
│     • Auto-post: "John earned CCRN certification"               │
│     • Share courses with connections                             │
│     • Instructor posts about new courses                        │
│                                                                  │
│  3. Connections ←→ Study Groups                                  │
│     • Invite connections to study groups                         │
│     • "Connections taking this course" social proof              │
│     • Peer recommendations: "3 connections completed this"       │
│     • Group enrollment with colleagues                          │
│                                                                  │
│  4. Messaging ←→ Course Discussion                               │
│     • Message instructor directly from course page              │
│     • Share course links in messages                            │
│     • Study group chat integrated with messaging                │
│                                                                  │
│  5. Cert Tracking ←→ Course Finder ←→ LMS                       │
│     • Expiring cert → Find recert class → Take refresher course │
│     • Complete course → Update certification record             │
│     • CE credits auto-applied to license renewal tracker        │
│                                                                  │
│  6. Medical Reference ←→ Courses ←→ Forums                      │
│     • Reference articles link to related courses                │
│     • Course lessons link to reference articles                 │
│     • Forum answers cite reference articles                     │
│     • Bookmarked articles in learning library                   │
│                                                                  │
│  7. Subscription ←→ All Features                                 │
│     • Tier gates access across all features                     │
│     • Upgrade prompts at natural friction points                │
│     • Usage tracking for tier recommendations                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
</code></pre><h2>10.2 Key Integration Scenarios</h2><h3>Scenario 1: The Certification Lifecycle (End-to-End)</h3><pre><code>1. User's BLS certification tracked in system (Cert Tracking)
2. 60-day expiration alert fires (Notification Service)
3. Alert includes "Find a class near you" link (Course Finder)
4. User also sees "Take BLS Refresher Course" (LMS)
5. User completes online refresher course (LMS → CE Credits)
6. User finds and registers for in-person recertification (Course Finder)
7. User completes recertification, uploads new card (Cert Tracking → OCR)
8. Profile automatically updated with new BLS badge (Networking → Profile)
9. Achievement auto-posted to feed: "Jane renewed BLS certification!" (Feed)
10. CE credits from refresher course applied to license renewal tracker (CE Management)
</code></pre><h3>Scenario 2: The Learning-to-Networking Loop</h3><pre><code>1. User completes "Advanced Cardiac Assessment" course (LMS)
2. Certificate issued and displayed on profile (Networking → Profile)
3. Achievement posted to feed (Feed)
4. Connections see the post, some enroll in the same course (Social Proof)
5. User joins "Cardiac Nursing" study group (Collaboration)
6. User answers cardiac questions in forum, citing course material (Forum)
7. User earns "Expert Contributor" badge after 50+ quality answers (Networking → Badge)
8. User's profile now shows: course completion + badge + forum activity (Profile)
9. Recruiters and peers discover user through enhanced profile (Networking → Discovery)
</code></pre><hr><h1>11. SECURITY, HIPAA COMPLIANCE &amp; INFRASTRUCTURE</h1><h2>11.1 Security Architecture</h2><p><em>All requirements from the prior document (SEC-001 through SEC-020) are incorporated, plus:</em></p><h3>11.1.1 Additional Security for LMS &amp; Payments</h3><table class="e-rte-table"> <thead> <tr> <th>Requirement</th> <th>Description</th> <th>Priority</th> </tr> </thead> <tbody><tr> <td>SEC-021</td> <td>PCI DSS compliance via Stripe (no card data stored on our servers)</td> <td>P0</td> </tr> <tr> <td>SEC-022</td> <td>DRM for premium video content (encrypted HLS streams)</td> <td>P1</td> </tr> <tr> <td>SEC-023</td> <td>Content watermarking for downloaded PDFs (user ID embedded)</td> <td>P2</td> </tr> <tr> <td>SEC-024</td> <td>Anti-piracy: screen recording detection for premium content</td> <td>P2</td> </tr> <tr> <td>SEC-025</td> <td>Subscription fraud detection (shared accounts, credential stuffing)</td> <td>P1</td> </tr> <tr> <td>SEC-026</td> <td>SCORM/xAPI content sandboxing (iframe isolation for third-party content)</td> <td>P0</td> </tr> <tr> <td>SEC-027</td> <td>Forum PHI detection using NLP (auto-flag posts containing potential patient info)</td> <td>P0</td> </tr> </tbody></table><h3>11.1.2 Infrastructure Security</h3><table class="e-rte-table"> <thead> <tr> <th>Layer</th> <th>Protection</th> </tr> </thead> <tbody><tr> <td><strong>Network</strong></td> <td>VPC isolation, private subnets for databases, NAT gateways, security groups</td> </tr> <tr> <td><strong>Application</strong></td> <td>WAF (AWS WAF), DDoS protection (AWS Shield), bot management</td> </tr> <tr> <td><strong>Data</strong></td> <td>Encryption at rest (AES-256), in transit (TLS 1.3), field-level encryption for PII</td> </tr> <tr> <td><strong>Identity</strong></td> <td>MFA, JWT with short-lived tokens (15 min) + refresh tokens (7 days), token rotation</td> </tr> <tr> <td><strong>Monitoring</strong></td> <td>Real-time threat detection, anomaly alerts, failed login monitoring</td> </tr> <tr> <td><strong>Compliance</strong></td> <td>SOC 2 Type II audit, annual HIPAA risk assessment, penetration testing (quarterly)</td> </tr> </tbody></table><h2>11.2 Infrastructure Sizing (Initial Launch)</h2><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Specification</th> <th>Estimated Monthly Cost</th> </tr> </thead> <tbody><tr> <td><strong>API Servers</strong></td> <td>4x ECS Fargate tasks (2 vCPU, 4GB RAM each)</td> <td>$400</td> </tr> <tr> <td><strong>PostgreSQL</strong></td> <td>RDS db.r6g.large (Multi-AZ)</td> <td>$500</td> </tr> <tr> <td><strong>MongoDB</strong></td> <td>Atlas M30 (dedicated cluster)</td> <td>$450</td> </tr> <tr> <td><strong>Redis</strong></td> <td>ElastiCache r6g.large (cluster mode)</td> <td>$300</td> </tr> <tr> <td><strong>Elasticsearch</strong></td> <td>OpenSearch t3.medium.search (3 nodes)</td> <td>$350</td> </tr> <tr> <td><strong>S3 Storage</strong></td> <td>500GB initial + CloudFront CDN</td> <td>$100</td> </tr> <tr> <td><strong>Video Hosting</strong></td> <td>Mux (1,000 hours stored, 10,000 hours streamed)</td> <td>$500</td> </tr> <tr> <td><strong>Email (SES)</strong></td> <td>100K emails/month</td> <td>$10</td> </tr> <tr> <td><strong>SMS (Twilio)</strong></td> <td>10K messages/month</td> <td>$80</td> </tr> <tr> <td><strong>Monitoring</strong></td> <td>Datadog (5 hosts)</td> <td>$250</td> </tr> <tr> <td><strong>Other</strong></td> <td>DNS, WAF, Secrets Manager, etc.</td> <td>$200</td> </tr> <tr> <td><strong>TOTAL</strong></td> <td><br></td> <td><strong>~$3,140/month</strong></td> </tr> </tbody></table><p><em>Scales to ~$8,000-12,000/month at 100K users.</em></p><hr><h1>12. IMPLEMENTATION ROADMAP</h1><h2>12.1 Development Phases</h2><h3>Phase 1: Foundation &amp; MVP (Months 1–6)</h3><p><strong>Goal:</strong> Launch core platform with profile, certification tracking, and basic course finder.</p><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Features</th> <th>Complexity</th> <th>Team Size</th> <th>Duration</th> </tr> </thead> <tbody><tr> <td><strong>Auth &amp; Identity</strong></td> <td>Registration, login, MFA, email verification, JWT</td> <td>Medium</td> <td>2 devs</td> <td>4 weeks</td> </tr> <tr> <td><strong>User Profile</strong></td> <td>Profile CRUD, education, experience, photo upload</td> <td>Medium</td> <td>2 devs</td> <td>4 weeks</td> </tr> <tr> <td><strong>Certification Tracking</strong></td> <td>Add/edit certs &amp; licenses, document upload, OCR, status dashboard</td> <td>High</td> <td>2 devs</td> <td>6 weeks</td> </tr> <tr> <td><strong>Expiration Alerts</strong></td> <td>Email + push notification scheduling and delivery</td> <td>Medium</td> <td>1 dev</td> <td>3 weeks</td> </tr> <tr> <td><strong>Course Finder (Basic)</strong></td> <td>Location search, AHA/Red Cross data, map view, list view</td> <td>High</td> <td>2 devs</td> <td>6 weeks</td> </tr> <tr> <td><strong>Subscription (Basic)</strong></td> <td>Free + Premium tiers, Stripe integration, billing</td> <td>Medium</td> <td>1 dev</td> <td>4 weeks</td> </tr> <tr> <td><strong>Admin Panel (Basic)</strong></td> <td>User management, content moderation, basic reports</td> <td>Medium</td> <td>1 dev</td> <td>4 weeks</td> </tr> <tr> <td><strong>Mobile App (Basic)</strong></td> <td>React Native shell with core features</td> <td>High</td> <td>2 devs</td> <td>8 weeks</td> </tr> <tr> <td><strong>Infrastructure</strong></td> <td>AWS setup, CI/CD, monitoring, security baseline</td> <td>High</td> <td>1 DevOps</td> <td>4 weeks</td> </tr> <tr> <td><strong>QA &amp; Testing</strong></td> <td>Unit tests, integration tests, security audit</td> <td>Medium</td> <td>1 QA</td> <td>Ongoing</td> </tr> </tbody></table><p><strong>Phase 1 Deliverables:</strong></p><ul> <li>Web app + iOS + Android apps</li> <li>User registration and professional profiles</li> <li>Certification and license tracking with expiration alerts</li> <li>Basic location-based recertification course finder</li> <li>Free and Premium subscription tiers</li> <li>Core notification system</li> </ul><p><strong>Phase 1 Team:</strong> 8-10 people (5-6 devs, 1 DevOps, 1 QA, 1 designer, 1 PM) <strong>Phase 1 Estimated Cost:</strong> $400K–$600K</p><hr><h3>Phase 2: Learning Platform (Months 7–12)</h3><p><strong>Goal:</strong> Launch full LMS with courses, progress tracking, and CE credit management.</p><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Features</th> <th>Complexity</th> <th>Dependencies</th> <th>Duration</th> </tr> </thead> <tbody><tr> <td><strong>LMS Core</strong></td> <td>Course catalog, enrollment, module/lesson structure</td> <td>Very High</td> <td>Auth, Profiles</td> <td>8 weeks</td> </tr> <tr> <td><strong>Video Infrastructure</strong></td> <td>Upload, transcoding, adaptive streaming, player</td> <td>High</td> <td>S3, Mux/MediaConvert</td> <td>6 weeks</td> </tr> <tr> <td><strong>Course Builder</strong></td> <td>Instructor portal, drag-and-drop builder, preview</td> <td>Very High</td> <td>LMS Core</td> <td>8 weeks</td> </tr> <tr> <td><strong>Quiz Engine</strong></td> <td>Question types, grading, attempts, feedback</td> <td>High</td> <td>LMS Core</td> <td>5 weeks</td> </tr> <tr> <td><strong>Progress Tracking</strong></td> <td>Lesson completion, course progress, resume learning</td> <td>Medium</td> <td>LMS Core</td> <td>4 weeks</td> </tr> <tr> <td><strong>CE Credit System</strong></td> <td>Auto-tracking, transcripts, state mapping, export</td> <td>High</td> <td>LMS Core, Cert Tracking</td> <td>5 weeks</td> </tr> <tr> <td><strong>Certificates</strong></td> <td>Auto-generation, PDF templates, verification codes</td> <td>Medium</td> <td>LMS Core</td> <td>3 weeks</td> </tr> <tr> <td><strong>Course Reviews</strong></td> <td>Ratings, reviews, helpful votes</td> <td>Low</td> <td>LMS Core</td> <td>2 weeks</td> </tr> <tr> <td><strong>Medical Reference (Initial)</strong></td> <td>100+ articles, citation system, search</td> <td>High</td> <td>Content team</td> <td>8 weeks</td> </tr> <tr> <td><strong>Content Partnerships</strong></td> <td>ANCC accreditation, content licensing agreements</td> <td>N/A (Business)</td> <td>—</td> <td>Ongoing</td> </tr> </tbody></table><p><strong>Phase 2 Deliverables:</strong></p><ul> <li>Full LMS with course catalog, enrollment, and progress tracking</li> <li>Video-based and text-based course delivery</li> <li>Quiz and assessment engine</li> <li>CE credit tracking with transcript generation</li> <li>Course certificates with verification</li> <li>Initial medical reference library (100+ articles with citations)</li> <li>Instructor portal for course creation</li> </ul><p><strong>Phase 2 Team:</strong> 10-12 people (6-7 devs, 1 DevOps, 1 QA, 1 designer, 1 PM, 1 content lead) <strong>Phase 2 Estimated Cost:</strong> $500K–$750K</p><hr><h3>Phase 3: Networking &amp; Collaboration (Months 13–18)</h3><p><strong>Goal:</strong> Launch full LinkedIn-style networking, messaging, forums, and study groups.</p><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Features</th> <th>Complexity</th> <th>Dependencies</th> <th>Duration</th> </tr> </thead> <tbody><tr> <td><strong>Connection System</strong></td> <td>Requests, acceptance, suggestions algorithm</td> <td>High</td> <td>Profiles</td> <td>5 weeks</td> </tr> <tr> <td><strong>Activity Feed</strong></td> <td>Posts, comments, likes, shares, feed algorithm</td> <td>Very High</td> <td>Connections</td> <td>8 weeks</td> </tr> <tr> <td><strong>Messaging</strong></td> <td>Direct + group messaging, WebSocket, file sharing</td> <td>Very High</td> <td>Connections</td> <td>8 weeks</td> </tr> <tr> <td><strong>Q&amp;A Forums</strong></td> <td>Threads, answers, voting, moderation, PHI detection</td> <td>High</td> <td>Auth, Profiles</td> <td>6 weeks</td> </tr> <tr> <td><strong>Study Groups</strong></td> <td>Create/join groups, shared resources, group chat</td> <td>Medium</td> <td>Messaging, Forums</td> <td>5 weeks</td> </tr> <tr> <td><strong>Notification System (Full)</strong></td> <td>All notification types, preferences, digest emails</td> <td>High</td> <td>All services</td> <td>5 weeks</td> </tr> <tr> <td><strong>Search (Full)</strong></td> <td>Elasticsearch: profiles, courses, articles, forums</td> <td>High</td> <td>All content</td> <td>5 weeks</td> </tr> <tr> <td><strong>Profile Enhancements</strong></td> <td>Skills, endorsements, badges, analytics</td> <td>Medium</td> <td>Connections</td> <td>4 weeks</td> </tr> <tr> <td><strong>Pro Tier Launch</strong></td> <td>Professional subscription tier with full features</td> <td>Low</td> <td>Subscription</td> <td>2 weeks</td> </tr> </tbody></table><p><strong>Phase 3 Deliverables:</strong></p><ul> <li>Full connection system with "People You May Know"</li> <li>Activity feed with relevance-ranked algorithm</li> <li>Real-time messaging (direct + group)</li> <li>Q&amp;A forums with moderation and PHI detection</li> <li>Study groups with shared resources</li> <li>Full notification system across all channels</li> <li>Professional subscription tier</li> </ul><p><strong>Phase 3 Team:</strong> 12-14 people <strong>Phase 3 Estimated Cost:</strong> $600K–$900K</p><hr><h3>Phase 4: Intelligence &amp; Scale (Months 19–24)</h3><p><strong>Goal:</strong> Add AI-powered features, enterprise tier, advanced analytics, and scale infrastructure.</p><table class="e-rte-table"> <thead> <tr> <th>Component</th> <th>Features</th> <th>Complexity</th> <th>Dependencies</th> <th>Duration</th> </tr> </thead> <tbody><tr> <td><strong>AI Recommendations</strong></td> <td>Course recommendations, connection suggestions (ML models)</td> <td>Very High</td> <td>All data</td> <td>8 weeks</td> </tr> <tr> <td><strong>Enterprise Portal</strong></td> <td>Team management, bulk enrollment, compliance dashboards, SSO</td> <td>Very High</td> <td>All features</td> <td>10 weeks</td> </tr> <tr> <td><strong>Mentorship Program</strong></td> <td>Matching algorithm, structured programs, milestones</td> <td>High</td> <td>Connections, Profiles</td> <td>6 weeks</td> </tr> <tr> <td><strong>Advanced Analytics</strong></td> <td>ClickHouse integration, custom dashboards, reporting</td> <td>High</td> <td>All services</td> <td>6 weeks</td> </tr> <tr> <td><strong>API Platform</strong></td> <td>Public API for credential verification, webhooks</td> <td>High</td> <td>Auth, Certs</td> <td>5 weeks</td> </tr> <tr> <td><strong>Content Scale</strong></td> <td>500+ reference articles, expanded course library</td> <td>N/A (Content)</td> <td>Content team</td> <td>Ongoing</td> </tr> <tr> <td><strong>Performance Optimization</strong></td> <td>Caching, CDN optimization, database tuning, load testing</td> <td>High</td> <td>All infrastructure</td> <td>4 weeks</td> </tr> <tr> <td><strong>Internationalization</strong></td> <td>Multi-language support (Spanish, French, Tagalog)</td> <td>Medium</td> <td>All UI</td> <td>6 weeks</td> </tr> </tbody></table><p><strong>Phase 4 Deliverables:</strong></p><ul> <li>AI-powered course and connection recommendations</li> <li>Enterprise tier with team management and compliance dashboards</li> <li>Mentorship matching program</li> <li>Advanced analytics and reporting</li> <li>Public API for third-party integrations</li> <li>500+ medical reference articles</li> <li>Performance optimization for 500K+ users</li> </ul><p><strong>Phase 4 Team:</strong> 14-16 people <strong>Phase 4 Estimated Cost:</strong> $700K–$1.0M</p><hr><h2>12.2 Dependency Map</h2><pre><code>Phase 1 (Foundation)
  │
  ├── Auth &amp; Identity ──────────────────────────────────┐
  │     │                                                │
  │     ├── User Profiles ──────────────────────┐        │
  │     │     │                                  │        │
  │     │     ├── Certification Tracking ────────┤        │
  │     │     │     │                            │        │
  │     │     │     ├── Expiration Alerts         │        │
  │     │     │     │                            │        │
  │     │     │     └── Course Finder ───────────┤        │
  │     │     │                                  │        │
  │     │     └── Subscription (Basic) ──────────┘        │
  │     │                                                │
Phase 2 (Learning)                                       │
  │     │                                                │
  │     ├── LMS Core ◄──────────────────────────────────┘
  │     │     │
  │     │     ├── Video Infrastructure
  │     │     ├── Course Builder
  │     │     ├── Quiz Engine
  │     │     ├── Progress Tracking
  │     │     ├── CE Credit System ◄── Certification Tracking
  │     │     ├── Certificates
  │     │     └── Course Reviews
  │     │
  │     └── Medical Reference Library
  │
Phase 3 (Networking)
  │     │
  │     ├── Connection System ◄── User Profiles
  │     │     │
  │     │     ├── Activity Feed ◄── LMS (achievements)
  │     │     ├── Messaging (WebSocket)
  │     │     ├── Q&amp;A Forums ◄── Medical Reference (citations)
  │     │     ├── Study Groups ◄── Messaging + Forums
  │     │     └── Full Search ◄── All content services
  │     │
  │     └── Pro Tier ◄── Subscription
  │
Phase 4 (Intelligence)
        │
        ├── AI Recommendations ◄── All user data + content
        ├── Enterprise Portal ◄── All features
        ├── Mentorship ◄── Connections + Profiles
        ├── Advanced Analytics ◄── All services
        └── Public API ◄── Auth + Certs + Profiles
</code></pre><h2>12.3 Milestone Summary</h2><table class="e-rte-table"> <thead> <tr> <th>Milestone</th> <th>Target Date</th> <th>Key Deliverable</th> </tr> </thead> <tbody><tr> <td>M1: Alpha</td> <td>Month 3</td> <td>Internal testing: auth, profiles, cert tracking</td> </tr> <tr> <td>M2: Beta</td> <td>Month 5</td> <td>Closed beta: 500 users, core features</td> </tr> <tr> <td>M3: MVP Launch</td> <td>Month 6</td> <td>Public launch: profiles, certs, course finder, Free+Premium</td> </tr> <tr> <td>M4: LMS Beta</td> <td>Month 9</td> <td>LMS beta with 50 courses</td> </tr> <tr> <td>M5: LMS Launch</td> <td>Month 12</td> <td>Full LMS, 200+ courses, CE tracking, medical reference</td> </tr> <tr> <td>M6: Networking Beta</td> <td>Month 15</td> <td>Connections, feed, messaging beta</td> </tr> <tr> <td>M7: Full Platform</td> <td>Month 18</td> <td>All features live, Pro tier, forums, study groups</td> </tr> <tr> <td>M8: Enterprise</td> <td>Month 21</td> <td>Enterprise tier, team management, SSO</td> </tr> <tr> <td>M9: Scale</td> <td>Month 24</td> <td>AI features, 500K+ users, API platform</td> </tr> </tbody></table><h2>12.4 Total Investment Summary</h2><table class="e-rte-table"> <thead> <tr> <th>Phase</th> <th>Duration</th> <th>Estimated Cost</th> <th>Cumulative</th> </tr> </thead> <tbody><tr> <td>Phase 1: Foundation &amp; MVP</td> <td>Months 1–6</td> <td>$400K–$600K</td> <td>$400K–$600K</td> </tr> <tr> <td>Phase 2: Learning Platform</td> <td>Months 7–12</td> <td>$500K–$750K</td> <td>$900K–$1.35M</td> </tr> <tr> <td>Phase 3: Networking &amp; Collaboration</td> <td>Months 13–18</td> <td>$600K–$900K</td> <td>$1.5M–$2.25M</td> </tr> <tr> <td>Phase 4: Intelligence &amp; Scale</td> <td>Months 19–24</td> <td>$700K–$1.0M</td> <td>$2.2M–$3.25M</td> </tr> <tr> <td><strong>TOTAL (24 months)</strong></td> <td><br></td> <td><br></td> <td><strong>$2.2M–$3.25M</strong></td> </tr> </tbody></table><p><em>Includes: engineering salaries, infrastructure, third-party services, content development, design, QA. Does not include: marketing, sales, legal, office space.</em></p><hr><h1>13. APPENDICES</h1><h2>Appendix A: API Endpoint Summary (Key Endpoints)</h2><pre><code>AUTH
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh-token
  POST   /api/v1/auth/forgot-password
  POST   /api/v1/auth/verify-email
  POST   /api/v1/auth/mfa/setup
  POST   /api/v1/auth/mfa/verify

PROFILES
  GET    /api/v1/profiles/:userId
  PUT    /api/v1/profiles/:userId
  GET    /api/v1/profiles/:userId/experience
  POST   /api/v1/profiles/:userId/experience
  GET    /api/v1/profiles/:userId/education
  POST   /api/v1/profiles/:userId/education
  GET    /api/v1/profiles/:userId/skills
  POST   /api/v1/profiles/:userId/skills/:skillId/endorse
  GET    /api/v1/profiles/search?q=&amp;specialty=&amp;location=

CONNECTIONS
  POST   /api/v1/connections/request
  PUT    /api/v1/connections/:connectionId/accept
  PUT    /api/v1/connections/:connectionId/decline
  GET    /api/v1/connections
  GET    /api/v1/connections/suggestions
  DELETE /api/v1/connections/:connectionId

FEED
  GET    /api/v1/feed
  POST   /api/v1/posts
  PUT    /api/v1/posts/:postId
  DELETE /api/v1/posts/:postId
  POST   /api/v1/posts/:postId/like
  POST   /api/v1/posts/:postId/comment
  POST   /api/v1/posts/:postId/share

CERTIFICATIONS
  GET    /api/v1/certifications
  POST   /api/v1/certifications
  PUT    /api/v1/certifications/:certId
  DELETE /api/v1/certifications/:certId
  POST   /api/v1/certifications/:certId/upload-document
  GET    /api/v1/certifications/alerts
  GET    /api/v1/certifications/types

LICENSES
  GET    /api/v1/licenses
  POST   /api/v1/licenses
  PUT    /api/v1/licenses/:licenseId
  POST   /api/v1/licenses/:licenseId/verify

COURSE FINDER
  GET    /api/v1/course-finder/search?cert_type=&amp;lat=&amp;lng=&amp;radius=&amp;date_from=
  GET    /api/v1/course-finder/courses/:courseId
  GET    /api/v1/course-finder/providers/:providerId
  POST   /api/v1/course-finder/providers/:providerId/review
  GET    /api/v1/course-finder/recommendations

LMS - COURSES
  GET    /api/v1/courses
  GET    /api/v1/courses/:courseId
  GET    /api/v1/courses/:courseId/modules
  GET    /api/v1/courses/:courseId/modules/:moduleId/lessons
  POST   /api/v1/courses/:courseId/enroll
  GET    /api/v1/courses/:courseId/progress
  PUT    /api/v1/courses/:courseId/lessons/:lessonId/progress
  POST   /api/v1/courses/:courseId/quizzes/:quizId/attempt
  GET    /api/v1/courses/:courseId/certificate

LMS - INSTRUCTOR
  POST   /api/v1/instructor/courses
  PUT    /api/v1/instructor/courses/:courseId
  POST   /api/v1/instructor/courses/:courseId/modules
  POST   /api/v1/instructor/courses/:courseId/modules/:moduleId/lessons
  POST   /api/v1/instructor/courses/:courseId/publish
  GET    /api/v1/instructor/courses/:courseId/analytics

CE CREDITS
  GET    /api/v1/ce-credits/transcript
  GET    /api/v1/ce-credits/summary
  GET    /api/v1/ce-credits/state-requirements/:state
  GET    /api/v1/ce-credits/export/pdf

MEDICAL REFERENCE
  GET    /api/v1/reference/articles
  GET    /api/v1/reference/articles/:articleId
  GET    /api/v1/reference/articles/search?q=&amp;specialty=
  POST   /api/v1/reference/articles/:articleId/bookmark
  GET    /api/v1/reference/drugs/:drugId
  GET    /api/v1/reference/drugs/interactions?drugs=

MESSAGING
  GET    /api/v1/messages/conversations
  POST   /api/v1/messages/conversations
  GET    /api/v1/messages/conversations/:conversationId/messages
  POST   /api/v1/messages/conversations/:conversationId/messages
  WebSocket: /ws/messages

FORUMS
  GET    /api/v1/forums/threads
  POST   /api/v1/forums/threads
  GET    /api/v1/forums/threads/:threadId
  POST   /api/v1/forums/threads/:threadId/answers
  POST   /api/v1/forums/threads/:threadId/answers/:answerId/vote
  PUT    /api/v1/forums/threads/:threadId/answers/:answerId/best

SUBSCRIPTIONS
  GET    /api/v1/subscriptions/plans
  POST   /api/v1/subscriptions/checkout
  GET    /api/v1/subscriptions/current
  PUT    /api/v1/subscriptions/current/cancel
  PUT    /api/v1/subscriptions/current/change-plan
  POST   /api/v1/subscriptions/webhook (Stripe webhooks)

NOTIFICATIONS
  GET    /api/v1/notifications
  PUT    /api/v1/notifications/:notificationId/read
  PUT    /api/v1/notifications/read-all
  GET    /api/v1/notifications/preferences
  PUT    /api/v1/notifications/preferences
</code></pre><h2>Appendix B: Environment Configuration</h2><pre><code>Environments:
  - Development (dev)    → Feature branches, local databases
  - Staging (staging)    → Pre-production, production-like data
  - Production (prod)    → Live environment, multi-AZ, auto-scaling

CI/CD Pipeline:
  1. Developer pushes to feature branch
  2. GitHub Actions runs: lint → unit tests → build → integration tests
  3. PR merged to main → auto-deploy to staging
  4. Manual approval → deploy to production (blue-green deployment)
  5. Automated smoke tests post-deployment
  6. Rollback capability within 5 minutes
</code></pre><h2>Appendix C: Key Performance Targets</h2><table class="e-rte-table"> <thead> <tr> <th>Metric</th> <th>Target</th> </tr> </thead> <tbody><tr> <td>API Response Time (p95)</td> <td>&lt; 200ms</td> </tr> <tr> <td>Page Load Time (LCP)</td> <td>&lt; 2.5 seconds</td> </tr> <tr> <td>Video Start Time</td> <td>&lt; 3 seconds</td> </tr> <tr> <td>Search Results</td> <td>&lt; 500ms</td> </tr> <tr> <td>WebSocket Message Delivery</td> <td>&lt; 100ms</td> </tr> <tr> <td>System Uptime</td> <td>99.9% (8.76 hours downtime/year max)</td> </tr> <tr> <td>Database Query Time (p95)</td> <td>&lt; 50ms</td> </tr> <tr> <td>Notification Delivery (email)</td> <td>&lt; 5 minutes</td> </tr> <tr> <td>Notification Delivery (push)</td> <td>&lt; 30 seconds</td> </tr> <tr> <td>OCR Processing Time</td> <td>&lt; 15 seconds per document</td> </tr> </tbody></table><hr><p><em>End of Technical Specification Document</em> <em>MedConnect Pro — Version 2.0</em></p>