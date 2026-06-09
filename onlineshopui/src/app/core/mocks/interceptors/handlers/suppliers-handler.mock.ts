import { HttpRequest, HttpResponse } from '@angular/common/http';
import { MOCK_SUPPLIERS } from '../../data/suppliers.mock';

export function handleSuppliersRequest(
    request: HttpRequest<unknown>
): HttpResponse<unknown> | null {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    // GET /suppliers
    if (request.method === 'GET' && pathSegments[pathSegments.length - 1] === 'suppliers') {
        return new HttpResponse({
            status: 200,
            body: MOCK_SUPPLIERS
        });
    }

    // GET /suppliers/:id
    if (request.method === 'GET' && pathSegments[pathSegments.length - 2] === 'suppliers') {
        const id = pathSegments[pathSegments.length - 1];
        const supplier = MOCK_SUPPLIERS.find(s => s.id === id);

        if (!supplier) {
            return new HttpResponse({
                status: 404,
                statusText: 'Not Found'
            });
        }

        return new HttpResponse({
            status: 200,
            body: supplier
        });
    }

    return null;
}
