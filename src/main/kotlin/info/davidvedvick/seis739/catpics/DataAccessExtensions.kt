package info.davidvedvick.seis739.catpics

import com.github.jasync.sql.db.QueryResult
import com.github.jasync.sql.db.general.ArrayRowData
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.createInstance
import kotlin.reflect.full.createType
import kotlin.reflect.full.memberProperties

val boolType = Boolean::class.createType()

inline fun <reified T : Any> entityFactory(): ProduceEntities<T> {
    val kClass = T::class
    val mutableProperties = kClass.memberProperties.filterIsInstance<KMutableProperty<*>>()
    return object : ProduceEntities<T> {
        override fun toEntity(rowData: ArrayRowData) =
            kClass.createInstance().also {
                for (prop in mutableProperties) {
                    if (!rowData.mapping.containsKey(prop.name)) continue;
                    val rowValue = rowData[prop.name]
                    val parsedValue = when (prop.returnType) {
                        boolType -> rowValue != 0
                        else -> rowValue
                    }
                    prop.setter.call(it, parsedValue)
                }
            }
    }
}

inline fun <T : Any> ProduceEntities<T>.toEntities(results: QueryResult) =
    results.rows.filterIsInstance<ArrayRowData>().map(::toEntity)

interface ProduceEntities<T> {
    fun toEntity(rowData: ArrayRowData) : T
}