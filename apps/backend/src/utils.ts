import { auth } from '@workspace/auth/server';

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

// extract Path types from getSchema
type Schema = Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>;

type Path = Schema['paths'];

export const OpenAPI = {
  getPaths: (prefix = '/auth/api') =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;

        reference[key] = paths[path] as Record<string, Path>;

        for (const method of Object.keys(paths[path] as Record<string, Path>)) {
          const operation = (reference[key] as Record<string, Path>)[method];

          if (
            operation &&
            typeof operation === 'object' &&
            'tags' in operation
          ) {
            operation.tags = ['Better Auth'] as any;
          }
        }
      }

      return reference;
    }) as Promise<Record<string, Path>>,
  components: getSchema().then(({ components }) => components) as Promise<
    Record<string, Path>
  >,
} as const;
