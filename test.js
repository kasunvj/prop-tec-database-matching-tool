function test(){
    var rows=
          [
            [ 'Name', 'Email', 'Firm', 'Video','type' ],
            [
              'Kat Collins',
              'kat@1sharpe.com',
              '1Sharpe Capital',
              'https://youtu.be/rP5VDCXWdQs',
              'Co-invest'
            ],
            [
              'Adam Schuit',
              'adam@aoproptech.com',
              'A/O PropTech',
              'https://youtu.be/wtZ30iNFPjY',
              'Co-Lead, Lead'
            ],
        ]
    
    name = 'Adam Schuit';

    dropdown_part = [
            'Co-Lead, Follow-on',
            'Co-invest, Follow-on, Lead',
            'Co-Lead, Lead'
          ]

    console.log(rows.filter(row => {
      //console.log(row);
      return (
        row[0].includes('')&&         //true
        dropdown_part.some(part => row[4].includes(part))  
      );
    }))
}

test();