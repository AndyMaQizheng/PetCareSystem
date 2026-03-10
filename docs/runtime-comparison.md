# Runtime & Orchestration Comparison

| Option | What It Is | Strengths | Weaknesses | Best Fit for PetCareSystem |
| --- | --- | --- | --- | --- |
| **Tomcat (Standalone WAR)** | Deploy Spring app as WAR into Apache Tomcat servlet container. Traditional Java EE model. | Mature, battle-tested, easy to host single app, good monitoring tooling. | Requires WAR packaging; less flexible for multi-service stack; managing static assets & miniapp build separately; scaling other components (MySQL, Angular) still manual. | Not ideal. We need Angular static hosting, MySQL, future schedulers; Tomcat only solves Java runtime portion. |
| **systemd (bare-metal services)** | Run each component (Spring JAR, Angular build on Nginx, MySQL) as systemd services on host OS. | Minimal overhead, straightforward logging, no container layer, easy to auto-start on boot. | Service isolation is manual; dependency management harder; environment parity between dev/prod lower; rollbacks more complex; packaging Angular & backend separately increases setup time. | Possible but increases ops burden; less portable than Docker Compose. |
| **Docker Compose** | Define multi-container stack (backend, web, MySQL, nginx) via YAML, run on single host. | Reproducible environments, easy to spin up/down entire stack, consistent across dev/staging/prod, isolates dependencies, integrates secrets via env files, simple scaling on single host. | Single-host scope (no built-in HA), need to watch resource usage, Compose CLI required, need discipline for backups/volumes. | **Recommended for current phase.** Matches requirement (single EC2), supports backend/web/db, easy to script deployment, minimal overhead. |
| **Kubernetes** | Cluster orchestrator for containers; supports scaling, service discovery, rolling updates. | High availability, auto-scaling, secrets/config management, service mesh, observability ecosystem. | Significant operational overhead; requires cluster (EKS/AKS/K3s), more cost; overkill for MVP; learning curve; adds complexities for persistent volumes (MySQL). | Future option if platform grows and needs multi-node scaling. Not justified now. |

## Summary
- **Short term**: Docker Compose on a single EC2 instance balances reproducibility and low ops cost. We can still wrap compose with systemd for auto-restart.
- **Medium term**: If we outgrow single host, we can migrate to ECS/Fargate or Kubernetes; architecture (Docker images + env vars) keeps path open.
- **Tomcat** is superseded by Spring Boot’s embedded server; no need to add another layer.
- **systemd-only** deployments are viable but less portable and more error-prone when multiple services (backend, web, db, scheduled jobs) need coordination.
