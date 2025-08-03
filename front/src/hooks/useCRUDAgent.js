// src/hooks/useCRUDAgent.js
// Hook personalizado para interactuar con el CRUD Agent de IOPeer

import { useState, useCallback, useEffect } from 'react'
import { useIopeer } from './useIopeer'

export const useCRUDAgent = () => {
  const { sendMessage } = useIopeer()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [moduleFiles, setModuleFiles] = useState({})
  const [validationResult, setValidationResult] = useState(null)

  // Limpiar estados
  const clearResults = useCallback(() => {
    setGeneratedCode(null)
    setModuleFiles({})
    setError(null)
    setValidationResult(null)
  }, [])

  // Generar CRUD básico
  const generateCRUD = useCallback(async (entityData) => {
    setLoading(true)
    setError(null)

    try {
      const message = {
        agent_id: "crud_agent",
        action: "generate_crud",
        data: {
          entity_name: entityData.entityName,
          fields: entityData.fields,
          operations: entityData.operations || ["create", "read", "update", "delete"],
          framework: entityData.framework || "fastapi",
          include_auth: entityData.includeAuth || false,
          include_pagination: entityData.includePagination || true
        }
      }

      const response = await sendMessage(message)

      if (response.status === 'success') {
        setGeneratedCode(response.data)
        setModuleFiles(response.data.files_structure || {})
        return response.data
      } else {
        throw new Error(response.error || 'Error generando CRUD')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sendMessage])

  // Generar API personalizada
  const generateAPI = useCallback(async (apiData) => {
    setLoading(true)
    setError(null)

    try {
      const message = {
        agent_id: "crud_agent",
        action: "generate_api",
        data: {
          endpoints: apiData.endpoints,
          models: apiData.models,
          config: apiData.config || {}
        }
      }

      const response = await sendMessage(message)

      if (response.status === 'success') {
        setGeneratedCode(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Error generando API')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sendMessage])

  // Generar módulo completo con arquitectura en capas
  const generateCompleteModule = useCallback(async (moduleData) => {
    setLoading(true)
    setError(null)

    try {
      const message = {
        agent_id: "crud_agent",
        action: "generate_complete_module",
        data: {
          entity_name: moduleData.entityName,
          fields: moduleData.fields,
          config: {
            architecture: moduleData.architecture || "layered", // simple, layered, clean
            include_tests: moduleData.includeTests !== false,
            include_docs: moduleData.includeDocs !== false,
            include_auth: moduleData.includeAuth || false
          }
        }
      }

      const response = await sendMessage(message)

      if (response.status === 'success') {
        setGeneratedCode(response.data)
        setModuleFiles(response.data.module_files || {})
        return response.data
      } else {
        throw new Error(response.error || 'Error generando módulo completo')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sendMessage])

  // Analizar entidad
  const analyzeEntity = useCallback(async (entityData) => {
    setLoading(true)
    setError(null)

    try {
      const message = {
        agent_id: "crud_agent",
        action: "analyze_entity",
        data: {
          entity_name: entityData.entityName,
          fields: entityData.fields
        }
      }

      const response = await sendMessage(message)

      if (response.status === 'success') {
        return response.data
      } else {
        throw new Error(response.error || 'Error analizando entidad')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sendMessage])

  // Validar esquema
  const validateSchema = useCallback(async (schemaData) => {
    try {
      const message = {
        agent_id: "crud_agent",
        action: "validate_schema",
        data: schemaData
      }

      const response = await sendMessage(message)

      if (response.status === 'success') {
        setValidationResult(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Error validando esquema')
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [sendMessage])

  // Obtener capacidades del agente
  const getCapabilities = useCallback(async () => {
    try {
      const message = {
        agent_id: "crud_agent",
        action: "get_capabilities"
      }

      const response = await sendMessage(message)
      return response.data || response
    } catch (err) {
      console.error('Error obteniendo capacidades:', err)
      return null
    }
  }, [sendMessage])

  // Utilidades para trabajar con el código generado
  const downloadCode = useCallback((filename = 'generated_code.py') => {
    if (!generatedCode?.complete_code) {
      console.warn('No hay código generado para descargar')
      return
    }

    const blob = new Blob([generatedCode.complete_code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [generatedCode])

  // Descargar todos los archivos del módulo como ZIP
  const downloadModuleFiles = useCallback(async (moduleName = 'generated_module') => {
    if (!moduleFiles || Object.keys(moduleFiles).length === 0) {
      console.warn('No hay archivos de módulo para descargar')
      return
    }

    // Usar JSZip si está disponible, o crear archivos individuales
    if (window.JSZip) {
      const JSZip = window.JSZip
      const zip = new JSZip()

      // Agregar cada archivo al ZIP
      Object.entries(moduleFiles).forEach(([filePath, content]) => {
        zip.file(filePath, content)
      })

      // Generar y descargar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${moduleName}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Fallback: descargar archivos individuales
      Object.entries(moduleFiles).forEach(([filePath, content]) => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = filePath.replace(/\//g, '_') // Reemplazar / con _
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
    }
  }, [moduleFiles])

  // Copiar código al clipboard
  const copyToClipboard = useCallback(async (codeType = 'complete') => {
    if (!generatedCode) {
      console.warn('No hay código generado para copiar')
      return false
    }

    let codeToCopy = ''

    switch (codeType) {
      case 'complete':
        codeToCopy = generatedCode.complete_code || ''
        break
      case 'models':
        codeToCopy = generatedCode.models_code || ''
        break
      case 'endpoints':
        codeToCopy = generatedCode.endpoints_code || ''
        break
      case 'sqlalchemy':
        codeToCopy = generatedCode.sqlalchemy_code || ''
        break
      default:
        codeToCopy = generatedCode.complete_code || ''
    }

    if (!codeToCopy) {
      console.warn(`No hay código de tipo '${codeType}' para copiar`)
      return false
    }

    try {
      await navigator.clipboard.writeText(codeToCopy)
      return true
    } catch (err) {
      console.error('Error copiando al clipboard:', err)
      return false
    }
  }, [generatedCode])

  // Helpers para crear estructuras de datos
  const createField = useCallback((name, type, options = {}) => {
    return {
      name,
      type,
      description: options.description || '',
      nullable: options.nullable !== false,
      unique: options.unique || false,
      index: options.index || false,
      default: options.default,
      primary_key: options.primaryKey || false,
      auto_generated: options.autoGenerated || false
    }
  }, [])

  const createEndpoint = useCallback((method, path, options = {}) => {
    return {
      method: method.toUpperCase(),
      path,
      description: options.description || '',
      parameters: options.parameters || [],
      body_schema: options.bodySchema,
      response_schema: options.responseSchema,
      auth_required: options.authRequired || false
    }
  }, [])

  // Templates predefinidos para entidades comunes
  const getEntityTemplate = useCallback((templateName) => {
    const templates = {
      user: {
        entityName: 'User',
        fields: [
          createField('email', 'email', { unique: true, description: 'Email del usuario' }),
          createField('username', 'string', { unique: true, description: 'Nombre de usuario' }),
          createField('full_name', 'string', { description: 'Nombre completo' }),
          createField('is_active', 'boolean', { default: true, description: 'Usuario activo' }),
          createField('is_superuser', 'boolean', { default: false, description: 'Es administrador' })
        ],
        includeAuth: true
      },

      product: {
        entityName: 'Product',
        fields: [
          createField('name', 'string', { description: 'Nombre del producto' }),
          createField('description', 'text', { description: 'Descripción del producto' }),
          createField('price', 'float', { description: 'Precio del producto' }),
          createField('stock', 'integer', { description: 'Stock disponible' }),
          createField('is_active', 'boolean', { default: true, description: 'Producto activo' })
        ]
      },

      order: {
        entityName: 'Order',
        fields: [
          createField('user_id', 'integer', { description: 'ID del usuario' }),
          createField('total_amount', 'float', { description: 'Monto total' }),
          createField('status', 'string', { description: 'Estado del pedido' }),
          createField('order_date', 'datetime', { description: 'Fecha del pedido' })
        ]
      },

      blog_post: {
        entityName: 'BlogPost',
        fields: [
          createField('title', 'string', { description: 'Título del post' }),
          createField('slug', 'string', { unique: true, description: 'URL amigable' }),
          createField('content', 'text', { description: 'Contenido del post' }),
          createField('author_id', 'integer', { description: 'ID del autor' }),
          createField('published', 'boolean', { default: false, description: 'Está publicado' }),
          createField('published_at', 'datetime', { nullable: true, description: 'Fecha de publicación' })
        ]
      }
    }

    return templates[templateName] || null
  }, [createField])

  // Validar datos antes de enviar
  const validateEntityData = useCallback((entityData) => {
    const errors = []

    if (!entityData.entityName) {
      errors.push('El nombre de la entidad es requerido')
    }

    if (!entityData.fields || entityData.fields.length === 0) {
      errors.push('Se requiere al menos un campo')
    }

    if (entityData.fields) {
      entityData.fields.forEach((field, index) => {
        if (!field.name) {
          errors.push(`El campo ${index + 1} requiere un nombre`)
        }
        if (!field.type) {
          errors.push(`El campo ${index + 1} requiere un tipo`)
        }
      })
    }

    return errors
  }, [])

  // Estado calculado
  const hasGeneratedCode = Boolean(generatedCode?.complete_code)
  const hasModuleFiles = Boolean(moduleFiles && Object.keys(moduleFiles).length > 0)
  const isValid = validationResult?.is_valid !== false

  return {
    // Estados
    loading,
    error,
    generatedCode,
    moduleFiles,
    validationResult,
    hasGeneratedCode,
    hasModuleFiles,
    isValid,

    // Acciones principales
    generateCRUD,
    generateAPI,
    generateCompleteModule,
    analyzeEntity,
    validateSchema,
    getCapabilities,

    // Utilidades
    downloadCode,
    downloadModuleFiles,
    copyToClipboard,
    clearResults,

    // Helpers
    createField,
    createEndpoint,
    getEntityTemplate,
    validateEntityData
  }
}

// Hook adicional para trabajar específicamente con workflows CRUD
export const useCRUDWorkflow = () => {
  const crudAgent = useCRUDAgent()
  const [workflowStep, setWorkflowStep] = useState('design') // design, generate, review, deploy
  const [entityDesign, setEntityDesign] = useState(null)
  const [workflowProgress, setWorkflowProgress] = useState(0)

  // Workflow completo: Diseño → Generación → Revisión → Deploy
  const runCompleteWorkflow = useCallback(async (initialData) => {
    try {
      setWorkflowStep('design')
      setWorkflowProgress(10)

      // Paso 1: Analizar y validar entidad
      const analysis = await crudAgent.analyzeEntity(initialData)
      setWorkflowProgress(25)

      // Paso 2: Validar esquema
      const validation = await crudAgent.validateSchema({ fields: initialData.fields })
      if (!validation.is_valid) {
        throw new Error(`Esquema inválido: ${validation.errors.join(', ')}`)
      }
      setWorkflowProgress(40)

      setWorkflowStep('generate')

      // Paso 3: Generar módulo completo
      const moduleResult = await crudAgent.generateCompleteModule({
        ...initialData,
        architecture: 'layered',
        includeTests: true,
        includeDocs: true
      })
      setWorkflowProgress(75)

      setWorkflowStep('review')
      setEntityDesign(moduleResult)
      setWorkflowProgress(90)

      // Paso 4: Workflow completado
      setWorkflowStep('completed')
      setWorkflowProgress(100)

      return {
        analysis,
        validation,
        module: moduleResult,
        workflow_completed: true
      }

    } catch (error) {
      setWorkflowStep('error')
      throw error
    }
  }, [crudAgent])

  // Reiniciar workflow
  const resetWorkflow = useCallback(() => {
    setWorkflowStep('design')
    setWorkflowProgress(0)
    setEntityDesign(null)
    crudAgent.clearResults()
  }, [crudAgent])

  return {
    ...crudAgent,
    workflowStep,
    workflowProgress,
    entityDesign,
    runCompleteWorkflow,
    resetWorkflow
  }
}

// Utilidades para componentes
export const CRUDAgentUtils = {
  // Formatear código para mostrar
  formatCode: (code, language = 'python') => {
    if (!code) return ''

    // Básico: agregar numeración de líneas
    return code
      .split('\n')
      .map((line, index) => `${(index + 1).toString().padStart(3, ' ')} | ${line}`)
      .join('\n')
  },

  // Estimar complejidad del módulo
  estimateComplexity: (fieldsCount, includeAuth, architecture) => {
    let complexity = fieldsCount * 2 // Base

    if (includeAuth) complexity += 3
    if (architecture === 'layered') complexity += 2
    if (architecture === 'clean') complexity += 4

    if (complexity <= 10) return 'Simple'
    if (complexity <= 20) return 'Moderado'
    return 'Complejo'
  },

  // Estimar tiempo de generación
  estimateGenerationTime: (fieldsCount, includeTests, includeDocs) => {
    let seconds = fieldsCount * 0.5 // 0.5 seg por campo

    if (includeTests) seconds += 2
    if (includeDocs) seconds += 1

    return Math.max(1, Math.round(seconds))
  },

  // Validar nombre de entidad
  validateEntityName: (name) => {
    if (!name) return 'El nombre es requerido'
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) return 'Debe comenzar con mayúscula y contener solo letras/números'
    if (name.length < 2) return 'Debe tener al menos 2 caracteres'
    if (name.length > 50) return 'No debe exceder 50 caracteres'
    return null
  },

  // Sugerir nombres de tabla
  suggestTableName: (entityName) => {
    return entityName.toLowerCase() + 's'
  },

  // Tipos de campo soportados
  getSupportedFieldTypes: () => [
    { value: 'string', label: 'Texto (String)', example: 'nombre, título' },
    { value: 'text', label: 'Texto Largo (Text)', example: 'descripción, contenido' },
    { value: 'integer', label: 'Número Entero (Integer)', example: 'edad, cantidad' },
    { value: 'float', label: 'Número Decimal (Float)', example: 'precio, peso' },
    { value: 'boolean', label: 'Verdadero/Falso (Boolean)', example: 'activo, publicado' },
    { value: 'datetime', label: 'Fecha y Hora (DateTime)', example: 'created_at' },
    { value: 'date', label: 'Fecha (Date)', example: 'fecha_nacimiento' },
    { value: 'email', label: 'Email', example: 'correo electrónico' },
    { value: 'url', label: 'URL', example: 'sitio web, enlace' }
  ],

  // Arquitecturas soportadas
  getSupportedArchitectures: () => [
    {
      value: 'simple',
      label: 'Simple',
      description: 'Modelos y endpoints básicos',
      complexity: 'Baja',
      files: 3
    },
    {
      value: 'layered',
      label: 'Capas (Layered)',
      description: 'Separación en Repository, Service y API',
      complexity: 'Media',
      files: 6
    },
    {
      value: 'clean',
      label: 'Clean Architecture',
      description: 'Arquitectura limpia con casos de uso',
      complexity: 'Alta',
      files: 10
    }
  ]
}
