<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Benvingut</title>
</head>
<body>
    <h1>Benvingut, {{ $name }}! </h1>

    <h2>Estàs registrat com a: {{ $rol }} </h2>

    <br>

    <p>Salutacions,<br>{{ config('app.name') }}</p>
    <img src="{{ url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOUtuTLg4GjPHbVBlgnpQGhXD9FN9GQ6omyA&s') }}" alt="Logo de Tenfe" style="width: 150px; height: auto;">
</body>
</html>
