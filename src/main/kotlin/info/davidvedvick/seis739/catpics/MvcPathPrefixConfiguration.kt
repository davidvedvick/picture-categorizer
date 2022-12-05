package info.davidvedvick.seis739.catpics

import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.RestController

import org.springframework.web.method.HandlerTypePredicate

import org.springframework.web.servlet.config.annotation.PathMatchConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class MvcPathPrefixConfiguration : WebMvcConfigurer {
    override fun configurePathMatch(configurer: PathMatchConfigurer) {
        configurer.addPathPrefix(ApiConfigurationConstants.pathPrefix, HandlerTypePredicate.forAnnotation(RestController::class.java))
    }
}