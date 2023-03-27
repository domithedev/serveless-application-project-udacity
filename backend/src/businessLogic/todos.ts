import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// Write GET TODO Function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get todos function called')
    return todosAccess.getAllTodos(userId)
}

// Write CREATE TODO function

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Called create todo function')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        attachmentUrl: s3AttachmentUrl,
        done: false,
        ...newTodo
    }

    return await todosAccess.createTodoItem(newItem)
}


// Update TODO function
export async function updateTodo(   
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
        logger.info('Update todo function called')
        return todosAccess.updateTodoItem(todoId,userId, todoUpdate)
    }


// DELETE TODO Function
export async function deleteTodo(
    todoId: string,
    userId: string
    ): Promise<string> {
        logger.info('Delete todo function called')
        return todosAccess.deleteTodoItem(todoId, userId)
    }


// Attachment Function
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
    ): Promise<string> {
        logger.info('Create attachment function called', userId, todoId)
        return attachmentUtils.getUploadUrl(todoId)
    }