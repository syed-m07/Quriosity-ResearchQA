.   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
'  |____| .__|_| |_|_| |_\__, | / / / /
=========|_|==============|___/=/_/_/_/

:: Spring Boot ::                (v3.5.4)

2025-08-20T09:15:06.481+05:30  INFO 504833 --- [           main] c.r.backend.BackendApplication           : Starting BackendApplication using Java 17.0.15 with PID 504833 (/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes started by maaz in /home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG)
2025-08-20T09:15:06.495+05:30  INFO 504833 --- [           main] c.r.backend.BackendApplication           : No active profile set, falling back to 1 default profile: "default"
2025-08-20T09:16:14.217+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2025-08-20T09:16:14.219+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2025-08-20T09:16:18.619+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 4092 ms. Found 4 JPA repository interfaces.
2025-08-20T09:16:19.293+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2025-08-20T09:16:19.354+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2025-08-20T09:16:19.826+05:30  INFO 504833 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.researchrag.backend.documentapi.repo.DocumentRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-08-20T09:16:19.827+05:30  INFO 504833 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.researchrag.backend.qaapi.repo.QaInteractionRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-08-20T09:16:19.828+05:30  INFO 504833 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.researchrag.backend.userapi.token.TokenRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-08-20T09:16:19.828+05:30  INFO 504833 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.researchrag.backend.userapi.user.UserRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2025-08-20T09:16:19.829+05:30  INFO 504833 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 53 ms. Found 0 Redis repository interfaces.
2025-08-20T09:16:34.045+05:30  INFO 504833 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8081 (http)
2025-08-20T09:16:34.257+05:30  INFO 504833 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2025-08-20T09:16:34.259+05:30  INFO 504833 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.43]
2025-08-20T09:16:35.220+05:30  INFO 504833 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2025-08-20T09:16:35.222+05:30  INFO 504833 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 86892 ms
2025-08-20T09:16:41.571+05:30  INFO 504833 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
2025-08-20T09:16:48.683+05:30  INFO 504833 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.6.22.Final
2025-08-20T09:16:49.319+05:30  INFO 504833 --- [           main] o.h.c.internal.RegionFactoryInitiator    : HHH000026: Second-level cache disabled
2025-08-20T09:17:03.028+05:30  INFO 504833 --- [           main] o.s.o.j.p.SpringPersistenceUnitInfo      : No LoadTimeWeaver setup: ignoring JPA class transformer
2025-08-20T09:17:05.492+05:30  INFO 504833 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2025-08-20T09:17:10.030+05:30  WARN 504833 --- [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 08S01
2025-08-20T09:17:10.030+05:30 ERROR 504833 --- [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
2025-08-20T09:17:10.031+05:30  WARN 504833 --- [           main] o.h.e.j.e.i.JdbcEnvironmentInitiator     : HHH000342: Could not obtain connection to query metadata

org.hibernate.exception.JDBCConnectionException: unable to obtain isolated JDBC connection [Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.] [n/a]
at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:100) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.exception.internal.StandardSQLExceptionConverter.convert(StandardSQLExceptionConverter.java:58) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:108) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:94) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcIsolationDelegate.delegateWork(JdbcIsolationDelegate.java:116) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator.getJdbcEnvironmentUsingJdbcMetadata(JdbcEnvironmentInitiator.java:336) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator.initiateService(JdbcEnvironmentInitiator.java:129) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator.initiateService(JdbcEnvironmentInitiator.java:81) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.registry.internal.StandardServiceRegistryImpl.initiateService(StandardServiceRegistryImpl.java:130) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.service.internal.AbstractServiceRegistryImpl.createService(AbstractServiceRegistryImpl.java:263) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.service.internal.AbstractServiceRegistryImpl.initializeService(AbstractServiceRegistryImpl.java:238) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.service.internal.AbstractServiceRegistryImpl.getService(AbstractServiceRegistryImpl.java:215) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.model.relational.Database.<init>(Database.java:45) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.internal.InFlightMetadataCollectorImpl.getDatabase(InFlightMetadataCollectorImpl.java:226) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.internal.InFlightMetadataCollectorImpl.<init>(InFlightMetadataCollectorImpl.java:194) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.model.process.spi.MetadataBuildingProcess.complete(MetadataBuildingProcess.java:171) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.metadata(EntityManagerFactoryBuilderImpl.java:1442) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1513) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:66) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:390) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:419) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:400) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.afterPropertiesSet(LocalContainerEntityManagerFactoryBean.java:366) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1873) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1822) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:607) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:691) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:513) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1375) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1205) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.applyPropertyValues(AbstractAutowireCapableBeanFactory.java:1725) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.populateBean(AbstractAutowireCapableBeanFactory.java:1474) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:606) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1683) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1628) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1395) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1232) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:413) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1375) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1205) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1683) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1628) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1395) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1232) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.getOrderedBeansOfType(ServletContextInitializerBeans.java:230) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:184) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:179) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAdaptableBeans(ServletContextInitializerBeans.java:164) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.<init>(ServletContextInitializerBeans.java:96) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.getServletContextInitializerBeans(ServletWebServerApplicationContext.java:271) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.selfInitialize(ServletWebServerApplicationContext.java:245) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatStarter.onStartup(TomcatStarter.java:52) ~[spring-boot-3.5.4.jar:3.5.4]
at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:4464) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264) ~[na:na]
at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145) ~[na:na]
at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardHost.startInternal(StandardHost.java:772) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264) ~[na:na]
at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145) ~[na:na]
at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardEngine.startInternal(StandardEngine.java:203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardService.startInternal(StandardService.java:412) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardServer.startInternal(StandardServer.java:870) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.startup.Tomcat.start(Tomcat.java:438) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:128) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.<init>(TomcatWebServer.java:107) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getTomcatWebServer(TomcatServletWebServerFactory.java:517) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getWebServer(TomcatServletWebServerFactory.java:219) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.createWebServer(ServletWebServerApplicationContext.java:193) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:167) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:621) ~[spring-context-6.2.9.jar:6.2.9]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:318) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350) ~[spring-boot-3.5.4.jar:3.5.4]
at com.researchrag.backend.BackendApplication.main(BackendApplication.java:10) ~[classes/:na]
Caused by: com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
at com.mysql.cj.jdbc.exceptions.SQLError.createCommunicationsException(SQLError.java:165) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:55) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:861) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.<init>(ConnectionImpl.java:449) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.getInstance(ConnectionImpl.java:234) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.NonRegisteringDriver.connect(NonRegisteringDriver.java:180) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:144) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:368) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:205) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:488) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:576) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:97) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111) ~[HikariCP-6.3.1.jar:na]
at org.hibernate.engine.jdbc.connections.internal.DatasourceConnectionProviderImpl.getConnection(DatasourceConnectionProviderImpl.java:126) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator$ConnectionProviderJdbcConnectionAccess.obtainConnection(JdbcEnvironmentInitiator.java:483) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.resource.transaction.backend.jdbc.internal.JdbcIsolationDelegate.delegateWork(JdbcIsolationDelegate.java:61) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
... 128 common frames omitted
Caused by: com.mysql.cj.exceptions.CJCommunicationsException: Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method) ~[na:na]
at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77) ~[na:na]
at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45) ~[na:na]
at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:500) ~[na:na]
at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:481) ~[na:na]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:52) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:95) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:140) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createCommunicationsException(ExceptionFactory.java:156) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:79) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.NativeSession.connect(NativeSession.java:139) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.connectOneTryOnly(ConnectionImpl.java:980) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:851) ~[mysql-connector-j-8.4.0.jar:8.4.0]
... 141 common frames omitted
Caused by: java.net.ConnectException: Connection refused
at java.base/sun.nio.ch.Net.pollConnect(Native Method) ~[na:na]
at java.base/sun.nio.ch.Net.pollConnectNow(Net.java:672) ~[na:na]
at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:547) ~[na:na]
at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:602) ~[na:na]
at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327) ~[na:na]
at java.base/java.net.Socket.connect(Socket.java:633) ~[na:na]
at com.mysql.cj.protocol.StandardSocketFactory.connect(StandardSocketFactory.java:144) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:53) ~[mysql-connector-j-8.4.0.jar:8.4.0]
... 144 common frames omitted

2025-08-20T09:17:11.444+05:30  WARN 504833 --- [           main] org.hibernate.orm.deprecation            : HHH90000025: MySQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2025-08-20T09:17:11.756+05:30  INFO 504833 --- [           main] org.hibernate.orm.connections.pooling    : HHH10001005: Database info:
Database JDBC URL [Connecting through datasource 'HikariDataSource (null)']
Database driver: undefined/unknown
Database version: 8.0
Autocommit mode: undefined/unknown
Isolation level: undefined/unknown
Minimum pool size: undefined/unknown
Maximum pool size: undefined/unknown
2025-08-20T09:17:17.976+05:30  INFO 504833 --- [           main] o.hibernate.id.enhanced.TableGenerator   : HHH000398: Explicit segment value for id generator [hibernate_sequences.sequence_name] suggested; using default [default]
2025-08-20T09:17:29.708+05:30  INFO 504833 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2025-08-20T09:17:29.939+05:30  INFO 504833 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2025-08-20T09:17:30.946+05:30  WARN 504833 --- [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 08S01
2025-08-20T09:17:30.946+05:30 ERROR 504833 --- [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
2025-08-20T09:17:30.951+05:30 ERROR 504833 --- [           main] j.LocalContainerEntityManagerFactoryBean : Failed to initialize JPA EntityManagerFactory: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.exception.JDBCConnectionException: Unable to open JDBC Connection for DDL execution [Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.] [n/a]
2025-08-20T09:17:30.953+05:30 ERROR 504833 --- [           main] o.s.b.web.embedded.tomcat.TomcatStarter  : Error starting Tomcat context. Exception: org.springframework.beans.factory.UnsatisfiedDependencyException. Message: Error creating bean with name 'jwtAuthenticationFilter' defined in file [/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes/com/researchrag/backend/common/config/JwtAuthenticationFilter.class]: Unsatisfied dependency expressed through constructor parameter 1: Error creating bean with name 'applicationConfig' defined in file [/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes/com/researchrag/backend/common/config/ApplicationConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.researchrag.backend.userapi.user.UserRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
2025-08-20T09:17:31.686+05:30  INFO 504833 --- [           main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2025-08-20T09:17:31.693+05:30  WARN 504833 --- [           main] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.context.ApplicationContextException: Unable to start web server
2025-08-20T09:17:31.708+05:30  INFO 504833 --- [           main] .s.b.a.l.ConditionEvaluationReportLogger :

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.
2025-08-20T09:17:32.016+05:30 ERROR 504833 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.context.ApplicationContextException: Unable to start web server
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:170) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:621) ~[spring-context-6.2.9.jar:6.2.9]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:752) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:439) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:318) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1361) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.SpringApplication.run(SpringApplication.java:1350) ~[spring-boot-3.5.4.jar:3.5.4]
at com.researchrag.backend.BackendApplication.main(BackendApplication.java:10) ~[classes/:na]
Caused by: org.springframework.boot.web.server.WebServerException: Unable to start embedded Tomcat
at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:147) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.<init>(TomcatWebServer.java:107) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getTomcatWebServer(TomcatServletWebServerFactory.java:517) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory.getWebServer(TomcatServletWebServerFactory.java:219) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.createWebServer(ServletWebServerApplicationContext.java:193) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:167) ~[spring-boot-3.5.4.jar:3.5.4]
... 8 common frames omitted
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'jwtAuthenticationFilter' defined in file [/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes/com/researchrag/backend/common/config/JwtAuthenticationFilter.class]: Unsatisfied dependency expressed through constructor parameter 1: Error creating bean with name 'applicationConfig' defined in file [/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes/com/researchrag/backend/common/config/ApplicationConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.researchrag.backend.userapi.user.UserRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1395) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1232) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:207) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.getOrderedBeansOfType(ServletContextInitializerBeans.java:230) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:184) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAsRegistrationBean(ServletContextInitializerBeans.java:179) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.addAdaptableBeans(ServletContextInitializerBeans.java:164) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.ServletContextInitializerBeans.<init>(ServletContextInitializerBeans.java:96) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.getServletContextInitializerBeans(ServletWebServerApplicationContext.java:271) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.selfInitialize(ServletWebServerApplicationContext.java:245) ~[spring-boot-3.5.4.jar:3.5.4]
at org.springframework.boot.web.embedded.tomcat.TomcatStarter.onStartup(TomcatStarter.java:52) ~[spring-boot-3.5.4.jar:3.5.4]
at org.apache.catalina.core.StandardContext.startInternal(StandardContext.java:4464) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264) ~[na:na]
at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145) ~[na:na]
at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardHost.startInternal(StandardHost.java:772) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.ContainerBase$StartChild.call(ContainerBase.java:1193) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264) ~[na:na]
at org.apache.tomcat.util.threads.InlineExecutorService.execute(InlineExecutorService.java:75) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at java.base/java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:145) ~[na:na]
at org.apache.catalina.core.ContainerBase.startInternal(ContainerBase.java:749) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardEngine.startInternal(StandardEngine.java:203) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardService.startInternal(StandardService.java:412) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.core.StandardServer.startInternal(StandardServer.java:870) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.util.LifecycleBase.start(LifecycleBase.java:164) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.apache.catalina.startup.Tomcat.start(Tomcat.java:438) ~[tomcat-embed-core-10.1.43.jar:10.1.43]
at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:128) ~[spring-boot-3.5.4.jar:3.5.4]
... 13 common frames omitted
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'applicationConfig' defined in file [/home/maaz/Desktop/Desktop/DesktopStuff/Projects/SpringBootProjects/ResearchRAG/backend/target/classes/com/researchrag/backend/common/config/ApplicationConfig.class]: Unsatisfied dependency expressed through constructor parameter 0: Error creating bean with name 'userRepository' defined in com.researchrag.backend.userapi.user.UserRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.autowireConstructor(ConstructorResolver.java:240) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.autowireConstructor(AbstractAutowireCapableBeanFactory.java:1395) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1232) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:413) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1375) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1205) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1683) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1628) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791) ~[spring-beans-6.2.9.jar:6.2.9]
... 54 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'userRepository' defined in com.researchrag.backend.userapi.user.UserRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.applyPropertyValues(AbstractAutowireCapableBeanFactory.java:1725) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.populateBean(AbstractAutowireCapableBeanFactory.java:1474) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:606) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.doResolveDependency(DefaultListableBeanFactory.java:1683) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultListableBeanFactory.resolveDependency(DefaultListableBeanFactory.java:1628) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveAutowiredArgument(ConstructorResolver.java:913) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:791) ~[spring-beans-6.2.9.jar:6.2.9]
... 76 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaSharedEM_entityManagerFactory': Cannot resolve reference to bean 'entityManagerFactory' while setting constructor argument
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:377) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveValueIfNecessary(BeanDefinitionValueResolver.java:135) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.resolveConstructorArguments(ConstructorResolver.java:691) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:513) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1375) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1205) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:569) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365) ~[spring-beans-6.2.9.jar:6.2.9]
... 89 common frames omitted
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.exception.JDBCConnectionException: Unable to open JDBC Connection for DDL execution [Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.] [n/a]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1826) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:607) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:529) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:339) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:373) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:337) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:202) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.BeanDefinitionValueResolver.resolveReference(BeanDefinitionValueResolver.java:365) ~[spring-beans-6.2.9.jar:6.2.9]
... 101 common frames omitted
Caused by: jakarta.persistence.PersistenceException: [PersistenceUnit: default] Unable to build Hibernate SessionFactory; nested exception is org.hibernate.exception.JDBCConnectionException: Unable to open JDBC Connection for DDL execution [Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.] [n/a]
at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:431) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.afterPropertiesSet(AbstractEntityManagerFactoryBean.java:400) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.afterPropertiesSet(LocalContainerEntityManagerFactoryBean.java:366) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1873) ~[spring-beans-6.2.9.jar:6.2.9]
at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1822) ~[spring-beans-6.2.9.jar:6.2.9]
... 108 common frames omitted
Caused by: org.hibernate.exception.JDBCConnectionException: Unable to open JDBC Connection for DDL execution [Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.] [n/a]
at org.hibernate.exception.internal.SQLStateConversionDelegate.convert(SQLStateConversionDelegate.java:100) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.exception.internal.StandardSQLExceptionConverter.convert(StandardSQLExceptionConverter.java:58) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:108) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.spi.SqlExceptionHelper.convert(SqlExceptionHelper.java:94) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.resource.transaction.backend.jdbc.internal.DdlTransactionIsolatorNonJtaImpl.getIsolatedConnection(DdlTransactionIsolatorNonJtaImpl.java:74) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.resource.transaction.backend.jdbc.internal.DdlTransactionIsolatorNonJtaImpl.getIsolatedConnection(DdlTransactionIsolatorNonJtaImpl.java:39) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.internal.exec.ImprovedExtractionContextImpl.getJdbcConnection(ImprovedExtractionContextImpl.java:63) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.internal.exec.ImprovedExtractionContextImpl.getJdbcDatabaseMetaData(ImprovedExtractionContextImpl.java:70) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.extract.internal.InformationExtractorJdbcDatabaseMetaDataImpl.processTableResultSet(InformationExtractorJdbcDatabaseMetaDataImpl.java:65) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.extract.internal.AbstractInformationExtractorImpl.getTables(AbstractInformationExtractorImpl.java:570) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.extract.internal.DatabaseInformationImpl.getTablesInformation(DatabaseInformationImpl.java:122) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.internal.GroupedSchemaMigratorImpl.performTablesMigration(GroupedSchemaMigratorImpl.java:72) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.internal.AbstractSchemaMigrator.performMigration(AbstractSchemaMigrator.java:233) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.internal.AbstractSchemaMigrator.doMigration(AbstractSchemaMigrator.java:112) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:280) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.lambda$process$5(SchemaManagementToolCoordinator.java:144) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at java.base/java.util.HashMap.forEach(HashMap.java:1421) ~[na:na]
at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.process(SchemaManagementToolCoordinator.java:141) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.internal.SessionFactoryObserverForSchemaExport.sessionFactoryCreated(SessionFactoryObserverForSchemaExport.java:37) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.internal.SessionFactoryObserverChain.sessionFactoryCreated(SessionFactoryObserverChain.java:35) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.internal.SessionFactoryImpl.<init>(SessionFactoryImpl.java:324) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.boot.internal.SessionFactoryBuilderImpl.build(SessionFactoryBuilderImpl.java:463) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl.build(EntityManagerFactoryBuilderImpl.java:1517) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.springframework.orm.jpa.vendor.SpringHibernateJpaPersistenceProvider.createContainerEntityManagerFactory(SpringHibernateJpaPersistenceProvider.java:66) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean.createNativeEntityManagerFactory(LocalContainerEntityManagerFactoryBean.java:390) ~[spring-orm-6.2.9.jar:6.2.9]
at org.springframework.orm.jpa.AbstractEntityManagerFactoryBean.buildNativeEntityManagerFactory(AbstractEntityManagerFactoryBean.java:419) ~[spring-orm-6.2.9.jar:6.2.9]
... 112 common frames omitted
Caused by: com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
at com.mysql.cj.jdbc.exceptions.SQLError.createCommunicationsException(SQLError.java:165) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:55) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:861) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.<init>(ConnectionImpl.java:449) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.getInstance(ConnectionImpl.java:234) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.NonRegisteringDriver.connect(NonRegisteringDriver.java:180) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:144) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:368) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:205) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:488) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:576) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:97) ~[HikariCP-6.3.1.jar:na]
at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111) ~[HikariCP-6.3.1.jar:na]
at org.hibernate.engine.jdbc.connections.internal.DatasourceConnectionProviderImpl.getConnection(DatasourceConnectionProviderImpl.java:126) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.engine.jdbc.env.internal.JdbcEnvironmentInitiator$ConnectionProviderJdbcConnectionAccess.obtainConnection(JdbcEnvironmentInitiator.java:483) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
at org.hibernate.resource.transaction.backend.jdbc.internal.DdlTransactionIsolatorNonJtaImpl.getIsolatedConnection(DdlTransactionIsolatorNonJtaImpl.java:46) ~[hibernate-core-6.6.22.Final.jar:6.6.22.Final]
... 133 common frames omitted
Caused by: com.mysql.cj.exceptions.CJCommunicationsException: Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method) ~[na:na]
at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77) ~[na:na]
at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45) ~[na:na]
at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:500) ~[na:na]
at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:481) ~[na:na]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:52) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:95) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:140) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.exceptions.ExceptionFactory.createCommunicationsException(ExceptionFactory.java:156) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:79) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.NativeSession.connect(NativeSession.java:139) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.connectOneTryOnly(ConnectionImpl.java:980) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:851) ~[mysql-connector-j-8.4.0.jar:8.4.0]
... 146 common frames omitted
Caused by: java.net.ConnectException: Connection refused
at java.base/sun.nio.ch.Net.pollConnect(Native Method) ~[na:na]
at java.base/sun.nio.ch.Net.pollConnectNow(Net.java:672) ~[na:na]
at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:547) ~[na:na]
at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:602) ~[na:na]
at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327) ~[na:na]
at java.base/java.net.Socket.connect(Socket.java:633) ~[na:na]
at com.mysql.cj.protocol.StandardSocketFactory.connect(StandardSocketFactory.java:144) ~[mysql-connector-j-8.4.0.jar:8.4.0]
at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:53) ~[mysql-connector-j-8.4.0.jar:8.4.0]
... 149 common frames omitted


Process finished with exit code 1
