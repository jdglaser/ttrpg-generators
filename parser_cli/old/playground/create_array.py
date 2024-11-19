t = {(1, 4): "Grassland", (5, 6): "Forest", (7, 8): "Hills", (9,): "Marsh", (10,): "Mountains"}

arr = {}
for k, v in t.items():
    if len(k) == 1:
        arr[k[0]] = v
    else:
        for i in range(k[0], k[1] + 1):
            arr[i] = v

print(arr)
print(len(arr))
