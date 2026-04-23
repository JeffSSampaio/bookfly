package com.jefferson.bookfly_api.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "BookFly",
                version = "v1",
                description = "Api de sistema de biblioteca com emprestimos e multas e movimentações"
        ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor local")
}
)
@Configuration
public class SwaggerConfig {
}
