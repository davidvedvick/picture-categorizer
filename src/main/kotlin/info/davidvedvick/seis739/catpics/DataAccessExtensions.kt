package info.davidvedvick.seis739.catpics

import com.github.jasync.sql.db.RowData
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.createInstance
import kotlin.reflect.full.createType
import kotlin.reflect.full.memberProperties

val boolType = Boolean::class.createType()

inline fun <reified T : Any> RowData.toEntity(): T {
    val kClass = T::class
    val mutableProperties = kClass.memberProperties.filterIsInstance<KMutableProperty<*>>()
    return kClass.createInstance().also {
        for (prop in mutableProperties) {
            val rowValue = this[prop.name] ?: continue
            val parsedValue = when (prop.returnType) {
                boolType -> rowValue != 0
                else -> rowValue
            }
            prop.setter.call(it, parsedValue)
        }
    }
}