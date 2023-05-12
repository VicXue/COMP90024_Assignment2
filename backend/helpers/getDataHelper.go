package helpers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func GetData(url string) (map[string]interface{}, error) {
	resp, err := http.Get(url)

	if err != nil {
		return nil, err
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Fatalln(err.Error())
		}
	}(resp.Body)

	body, _ := io.ReadAll(resp.Body)

	var raw map[string]interface{}

	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, err
	}

	return raw, nil
}
