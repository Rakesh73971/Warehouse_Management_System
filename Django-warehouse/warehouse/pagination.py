from rest_framework.pagination import PageNumberPagination


class DefaultPageSize(PageNumberPagination):
    page_size = 10